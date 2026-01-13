# SVG ESLint Parser 改进实施路线图

## 第一阶段：节点类型简化（推荐首先实施）

### Phase 1.1: 分析当前使用情况

```bash
# 检查每个节点类型被使用的次数
grep -r "NodeTypes\." src/ | wc -l
grep -r "type: NodeTypes\." src/ | cut -d: -f2 | sort | uniq -c
```

### Phase 1.2: 创建简化方案对照表

```typescript
// src/constants/nodeTypesRefined.ts
/**
 * 简化后的节点类型
 * 删除了所有 Wrapper 和 Delimiter 节点
 */
export enum NodeTypesRefined {
  // 容器
  Document = 'Document',
  Program = 'Program',

  // 标签
  Tag = 'Tag',
  Attribute = 'Attribute',
  AttributeKey = 'AttributeKey',
  AttributeValue = 'AttributeValue',

  // 注释
  Comment = 'Comment',

  // 文档类型
  Doctype = 'Doctype',
  DoctypeAttribute = 'DoctypeAttribute',
  DoctypeAttributeValue = 'DoctypeAttributeValue',

  // XML声明
  XMLDeclaration = 'XMLDeclaration',
  XMLDeclarationAttribute = 'XMLDeclarationAttribute',
  XMLDeclarationAttributeValue = 'XMLDeclarationAttributeValue',

  // 文本
  Text = 'Text',

  // 错误恢复
  Error = 'Error',
}
```

### Phase 1.3: 重构 Tag 节点

```typescript
// src/types/ast/node.ts - 改进版
export interface TagNode extends BaseNode {
  type: NodeTypes.Tag
  name: string
  selfClosing: boolean
  attributes: AttributeNode[]
  children: NestableNode[]

  // 新增：精确位置信息
  nameRange: Range
  openRange: Range // <svg
  closeRange?: Range // </svg> (如果有)
}

// 删除这些不必要的节点：
// - OpenTagStartNode
// - OpenTagEndNode
// - CloseTagNode
```

### Phase 1.4: 重构 Comment 节点

```typescript
// 改进前
interface CommentNode {
  type: NodeTypes.Comment
  open: CommentOpenNode // value: "<!--"
  close: CommentCloseNode // value: "-->"
  value: CommentContentNode
}

// 改进后
interface CommentNode extends BaseNode {
  type: NodeTypes.Comment
  content: string // 直接存储内容
  contentRange: Range // 内容范围
  openRange: Range // <!--范围
  closeRange: Range // -->范围
}
```

### Phase 1.5: 重构 Attribute 节点

```typescript
// 改进前
interface AttributeNode {
  key: AttributeKeyNode
  value: AttributeValueNode
  startWrapper?: AttributeValueWrapperStartNode
  endWrapper?: AttributeValueWrapperEndNode
}

// 改进后
interface AttributeNode extends BaseNode {
  type: NodeTypes.Attribute
  key: string
  value: string
  quoteChar?: '"' | "'" | undefined
  keyRange: Range
  valueRange: Range
  quoteRanges?: [Range, Range]
}

// 可以删除：
// - AttributeKeyNode (直接用字符串)
// - AttributeValueWrapperStartNode
// - AttributeValueWrapperEndNode
```

---

## 第二阶段：错误处理机制（关键功能）

### Phase 2.1: 定义错误类型

```typescript
// src/types/errors.ts
export enum ParseErrorType {
  UnclosedTag = 'UnclosedTag',
  MismatchedTag = 'MismatchedTag',
  InvalidAttribute = 'InvalidAttribute',
  MalformedComment = 'MalformedComment',
  InvalidDoctypeAttribute = 'InvalidDoctypeAttribute',
  UnmatchedQuote = 'UnmatchedQuote',
  InvalidXMLDeclaration = 'InvalidXMLDeclaration',
}

export interface ParseError {
  type: ParseErrorType
  message: string
  range: Range
  loc: SourceLocation
  recovery?: string // 恢复建议
}

export interface ErrorNode extends BaseNode {
  type: NodeTypes.Error
  errorType: ParseErrorType
  details: ParseError
  recoveredNode?: AnyNode // 尝试恢复后的节点
}
```

### Phase 2.2: 实现错误收集

```typescript
// src/parser/errorHandler.ts
export class ErrorHandler {
  private errors: ParseError[] = []

  addError(error: ParseError): void {
    this.errors.push(error)
  }

  getErrors(): ParseError[] {
    return this.errors
  }

  hasErrors(): boolean {
    return this.errors.length > 0
  }

  clear(): void {
    this.errors = []
  }

  // 根据错误进行恢复
  recover(state: TokenizerState, errorType: ParseErrorType): void {
    switch (errorType) {
      case ParseErrorType.UnclosedTag:
        // 自动闭合标签
        state.currentContext = TokenizerContextTypes.Data
        break
      case ParseErrorType.UnmatchedQuote:
        // 自动添加匹配的引号
        state.decisionBuffer.concat(state.lastQuoteChar || '"')
        break
      // ... 其他恢复策略
    }
  }
}
```

### Phase 2.3: 集成到解析器

```typescript
// src/parser/parse.ts - 改进版
export function parse(source: string, options: Options = {}): ParseResult {
  const errorHandler = new ErrorHandler()

  try {
    const { tokens } = tokenize(source, { errorHandler })
    const { ast } = constructTree(tokens, { errorHandler })

    return {
      ast: clearParent(ast),
      tokens,
      errors: errorHandler.getErrors(),
      hasErrors: errorHandler.hasErrors(),
    }
  } catch (e) {
    // 优雅处理
    errorHandler.addError({
      type: ParseErrorType.InvalidXMLDeclaration,
      message: `Parse failed: ${e.message}`,
      range: [0, source.length],
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
    })

    return {
      ast: createEmptyDocument(),
      tokens: [],
      errors: errorHandler.getErrors(),
      hasErrors: true,
    }
  }
}
```

---

## 第三阶段：消除代码重复（质量提升）

### Phase 3.1: 创建 Handler 工厂

```typescript
// src/constructor/factories/handlerFactory.ts
export type TokenMatcher =
  | TokenTypes
  | TokenTypes[]
  | ((t: TokenTypes) => boolean)

export type TokenHandler = (
  token: AnyToken,
  state: ConstructTreeState<any>,
) => ConstructTreeState<any>

export interface HandlerRule {
  match: TokenMatcher
  handle: TokenHandler
}

export function createDispatcher(rules: HandlerRule[]) {
  return (
    token: AnyToken,
    state: ConstructTreeState<any>,
  ): ConstructTreeState<any> => {
    for (const rule of rules) {
      const matches =
        typeof rule.match === 'function'
          ? rule.match(token.type as TokenTypes)
          : Array.isArray(rule.match)
            ? rule.match.includes(token.type as TokenTypes)
            : rule.match === token.type

      if (matches) {
        return rule.handle(token, state)
      }
    }
    return state
  }
}
```

### Phase 3.2: 重构现有 Handler

```typescript
// src/constructor/handlers/comment.ts - 优化版
import { createDispatcher } from '../factories/handlerFactory'

function handleCommentOpen(
  state: ConstructTreeState<ContextualCommentNode>,
  token: AnyToken,
) {
  state.currentNode.open = createNodeFrom(token) as CommentOpenNode
  state.caretPosition++
  return state
}

function handleCommentContent(
  state: ConstructTreeState<ContextualCommentNode>,
  token: AnyToken,
) {
  state.currentNode.value = createNodeFrom(token) as CommentContentNode
  state.caretPosition++
  return state
}

function handleCommentClose(
  state: ConstructTreeState<ContextualCommentNode>,
  token: AnyToken,
) {
  state.currentNode.close = createNodeFrom(token) as CommentCloseNode
  updateNodeEnd(state.currentNode, token)
  state.currentNode = state.currentNode.parentRef!
  state.currentContext = state.currentContext.parentRef!
  state.caretPosition++
  return state
}

export const construct = createDispatcher([
  { match: TokenTypes.CommentOpen, handle: handleCommentOpen },
  { match: TokenTypes.CommentContent, handle: handleCommentContent },
  { match: TokenTypes.CommentClose, handle: handleCommentClose },
])
```

### Phase 3.3: 验证所有 Context 都有处理

```typescript
// src/constructor/handlers/index.ts - 改进版
import { ConstructTreeContextTypes } from '../../constants'
import type { ConstructTreeHandler } from '../../types'

const contextHandlers = {
  [ConstructTreeContextTypes.Tag]: tag,
  [ConstructTreeContextTypes.TagName]: tagName,
  [ConstructTreeContextTypes.TagContent]: tagContent,
  [ConstructTreeContextTypes.Attributes]: attributes,
  [ConstructTreeContextTypes.Attribute]: attribute,
  [ConstructTreeContextTypes.AttributeValue]: attributeValue,
  [ConstructTreeContextTypes.Doctype]: doctype,
  [ConstructTreeContextTypes.DoctypeAttribute]: doctypeAttribute,
  [ConstructTreeContextTypes.DoctypeAttributes]: doctypeAttributes,
  [ConstructTreeContextTypes.Comment]: comment,
  [ConstructTreeContextTypes.XMLDeclaration]: xmlDeclaration,
  [ConstructTreeContextTypes.XMLDeclarationAttribute]: xmlDeclarationAttribute,
  [ConstructTreeContextTypes.XMLDeclarationAttributes]:
    xmlDeclarationAttributes,
  [ConstructTreeContextTypes.XMLDeclarationAttributeValue]:
    xmlDeclarationAttributeValue,
} satisfies Record<ConstructTreeContextTypes, ConstructTreeHandler>
// 这样如果漏掉了任何 context，TypeScript 会报错！

export default contextHandlers
```

---

## 第四阶段：添加 AST 工具函数

### Phase 4.1: AST 访问工具

```typescript
// src/utils/astQuery.ts
import type { AnyNode, DocumentNode, Range } from '../types'

/**
 * 查找所有匹配谓词的节点
 */
export function findNodes(
  root: DocumentNode,
  predicate: (node: AnyNode) => boolean,
): AnyNode[] {
  const results: AnyNode[] = []

  function traverse(node: AnyNode) {
    if (predicate(node)) {
      results.push(node)
    }

    if ('children' in node) {
      node.children.forEach(traverse)
    }
    if ('attributes' in node) {
      node.attributes.forEach(traverse)
    }
  }

  root.children.forEach(traverse)
  return results
}

/**
 * 查找指定范围内的节点
 */
export function findNodesByRange(root: DocumentNode, range: Range): AnyNode[] {
  return findNodes(
    root,
    node => node.range[0] >= range[0] && node.range[1] <= range[1],
  )
}

/**
 * 获取节点到根的路径
 */
export function getNodePath(root: DocumentNode, target: AnyNode): AnyNode[] {
  const path: AnyNode[] = []

  function findPath(node: AnyNode): boolean {
    path.push(node)

    if (node === target) {
      return true
    }

    if ('children' in node) {
      for (const child of node.children) {
        if (findPath(child)) {
          return true
        }
      }
    }
    if ('attributes' in node) {
      for (const attr of node.attributes) {
        if (findPath(attr)) {
          return true
        }
      }
    }

    path.pop()
    return false
  }

  for (const child of root.children) {
    if (findPath(child)) {
      return path
    }
  }

  return []
}

/**
 * 获取节点的父节点
 */
export function getParentNode(
  root: DocumentNode,
  target: AnyNode,
): AnyNode | null {
  const path = getNodePath(root, target)
  return path.length > 1 ? path[path.length - 2] : null
}
```

### Phase 4.2: AST 修改工具

```typescript
// src/utils/astModifier.ts
import type { AnyNode } from '../types'

/**
 * 深度克隆节点
 */
export function cloneNode<T extends AnyNode>(node: T): T {
  return JSON.parse(JSON.stringify(node))
}

/**
 * 更新节点属性（不可变方式）
 */
export function updateNode<T extends AnyNode>(node: T, updates: Partial<T>): T {
  return { ...node, ...updates } as T
}

/**
 * 删除节点属性
 */
export function removeNodeProperty<T extends AnyNode, K extends keyof T>(
  node: T,
  ...keys: K[]
): Omit<T, K> {
  const result = { ...node }
  keys.forEach(key => {
    delete result[key]
  })
  return result as Omit<T, K>
}
```

### Phase 4.3: 添加到 utils 索引

```typescript
// src/utils/index.ts
export * from './calculateTokenCharactersRange'
export * from './calculateTokenLocation'
export * from './calculateTokenPosition'
export * from './clearParent'
export * from './cloneLocation'
export * from './cloneRange'
export * from './createNodeFrom'
export * from './firstLast'
export * from './getLastAttribute'
export * from './getLineInfo'
export * from './initIfNone'
export * from './isWhitespace'
export * from './parseCloseTagName'
export * from './parseOpenTagName'
export * from './updateNodeEnd'
export * from './astQuery' // 新增
export * from './astModifier' // 新增
```

---

## 第五阶段：完善测试套件

### Phase 5.1: 边界情况测试

```typescript
// tests/parse/edge-cases.test.ts
import { unindent as $ } from '@ntnyq/utils'
import { expect, it, describe } from 'vitest'
import { parseForESLint } from '../../src'

describe('Edge Cases', () => {
  describe('Empty Elements', () => {
    it('should parse empty svg', () => {
      const svg = '<svg></svg>'
      const { ast } = parseForESLint(svg)
      expect(ast.body[0].children).toHaveLength(1)
      expect(ast.body[0].children[0].children).toHaveLength(0)
    })

    it('should parse self-closing tags', () => {
      const svg = $`
        <svg>
          <circle />
          <rect/>
        </svg>
      `
      const { ast } = parseForESLint(svg)
      const svg_element = ast.body[0].children[0]
      expect(svg_element.children).toHaveLength(2)
      expect(svg_element.children[0].selfClosing).toBe(true)
    })
  })

  describe('Attributes', () => {
    it('should handle attributes without values', () => {
      const svg = '<svg disabled></svg>'
      const { ast } = parseForESLint(svg)
      const svg_element = ast.body[0].children[0]
      expect(svg_element.attributes).toHaveLength(1)
    })

    it('should handle single-quoted attributes', () => {
      const svg = "<svg attr='value'></svg>"
      const { ast } = parseForESLint(svg)
      const svg_element = ast.body[0].children[0]
      expect(svg_element.attributes[0].quoteChar).toBe("'")
    })

    it('should handle unquoted attributes', () => {
      const svg = '<svg attr=value></svg>'
      const { ast } = parseForESLint(svg)
      const svg_element = ast.body[0].children[0]
      expect(svg_element.attributes[0].quoteChar).toBeUndefined()
    })
  })

  describe('Deep Nesting', () => {
    it('should handle deeply nested elements', () => {
      const svg = $`
        <svg>
          <g>
            <g>
              <g>
                <circle />
              </g>
            </g>
          </g>
        </svg>
      `
      const { ast } = parseForESLint(svg)
      expect(ast).toBeDefined()
    })
  })

  describe('Special Characters', () => {
    it('should handle entities in text', () => {
      const svg = '<svg>&lt;&gt;&amp;</svg>'
      const { ast } = parseForESLint(svg)
      expect(ast).toBeDefined()
    })

    it('should handle CDATA sections', () => {
      const svg = '<svg><![CDATA[some content]]></svg>'
      const { ast } = parseForESLint(svg)
      expect(ast).toBeDefined()
    })
  })
})
```

### Phase 5.2: 错误处理测试

```typescript
// tests/parse/errors.test.ts
describe('Error Handling', () => {
  describe('Malformed SVG', () => {
    it('should detect unclosed tags', () => {
      const svg = '<svg><rect>'
      const result = parseForESLint(svg)
      expect(result.errors).toBeDefined()
      expect(result.errors!.length).toBeGreaterThan(0)
    })

    it('should detect mismatched tags', () => {
      const svg = '<svg><rect></svg>'
      const result = parseForESLint(svg)
      expect(result.errors).toBeDefined()
    })

    it('should detect unmatched quotes', () => {
      const svg = '<svg attr="value></svg>'
      const result = parseForESLint(svg)
      expect(result.errors).toBeDefined()
    })
  })

  describe('Error Recovery', () => {
    it('should recover from unclosed tag', () => {
      const svg = '<svg><rect><circle></svg>'
      const { ast, errors } = parseForESLint(svg)
      expect(errors).toBeDefined()
      expect(ast.body[0].children).toBeDefined()
    })
  })
})
```

---

## 实施时间估计

| 阶段     | 任务         | 预计时间       | 优先级 |
| -------- | ------------ | -------------- | ------ |
| 1.1-1.5  | 节点类型简化 | 4-6 小时       | 🔴 高  |
| 2.1-2.3  | 错误处理     | 6-8 小时       | 🔴 高  |
| 3.1-3.3  | 代码去重     | 3-4 小时       | 🟡 中  |
| 4.1-4.3  | AST 工具     | 3-4 小时       | 🟡 中  |
| 5.1-5.2  | 完善测试     | 4-5 小时       | 🟡 中  |
| **总计** |              | **20-27 小时** |        |

---

## 检查清单

在完成每个阶段后，检查以下项目：

- [ ] 所有 TypeScript 类型检查通过 (`pnpm run typecheck`)
- [ ] 所有测试通过 (`pnpm run test`)
- [ ] 没有 linting 错误 (`pnpm run lint`)
- [ ] 更新了相关文档
- [ ] 更新了快照测试 (`pnpm run test -- -u`)
- [ ] 代码覆盖率没有下降
- [ ] 向后兼容性检查（如果是重大变化，需要版本号调整）

---

## 相关命令

```bash
# 构建并监听
pnpm run dev

# 运行所有检查
pnpm run release:check

# 只运行测试
pnpm run test

# 更新测试快照
pnpm run test -- -u

# 生成文档
pnpm run docs:dev

# 类型检查
pnpm run typecheck

# Linting
pnpm run lint
```
