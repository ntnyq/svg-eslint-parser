import { NodeTypes, TokenTypes } from '../constants'
import { ParseErrorType } from '../types'
import { cloneLocation, cloneRange } from '../utils'
import type {
  AnyToken,
  AttributeNode,
  CommentNode,
  DoctypeNode,
  DocumentNode,
  ElementNode,
  Locations,
  ParseError,
  ProcessingInstructionNode,
  XMLDeclarationAttributeNode,
  XMLDeclarationNode,
} from '../types'

const XML_NAME_PATTERN =
  /^[:_\p{L}\p{Nl}][.:_\p{L}\p{Nl}\p{Mn}\p{Mc}\p{Nd}\u00B7\u203F\u2040-]*$/u
const ENCODING_NAME_PATTERN = /^[A-Za-z][\w.-]*$/u
const XML_DECLARATION_ATTRIBUTE_ORDER = new Map([
  ['version', 0],
  ['encoding', 1],
  ['standalone', 2],
])

function addError(
  errors: ParseError[],
  type: ParseErrorType,
  message: string,
  location: Locations,
  recovery: string,
): void {
  errors.push({
    type,
    message,
    range: cloneRange(location.range),
    loc: cloneLocation(location.loc),
    recovery,
  })
}

function isValidXMLName(name: string): boolean {
  return XML_NAME_PATTERN.test(name)
}

function validateAttribute(
  attribute: AttributeNode,
  seenNames: Set<string>,
  errors: ParseError[],
): void {
  const name = attribute.key?.value

  if (!name) {
    addError(
      errors,
      ParseErrorType.InvalidAttribute,
      'An attribute must have a name.',
      attribute,
      'The parser kept the incomplete attribute in the AST.',
    )
    return
  }

  if (!isValidXMLName(name)) {
    addError(
      errors,
      ParseErrorType.InvalidAttribute,
      `Invalid attribute name "${name}".`,
      attribute.key,
      'The parser kept the attribute in the AST.',
    )
  }

  if (seenNames.has(name)) {
    addError(
      errors,
      ParseErrorType.DuplicateAttribute,
      `Duplicate attribute "${name}".`,
      attribute,
      'The parser kept every duplicate attribute in source order.',
    )
  } else {
    seenNames.add(name)
  }

  if (!attribute.value) {
    addError(
      errors,
      ParseErrorType.InvalidAttribute,
      `Attribute "${name}" must have a value.`,
      attribute,
      'The parser kept the valueless attribute in the AST.',
    )
    return
  }

  if (!attribute.quoteChar) {
    addError(
      errors,
      ParseErrorType.InvalidAttribute,
      `Attribute "${name}" value must be quoted.`,
      attribute.value,
      'The parser kept the unquoted value in the AST.',
    )
  }

  if (attribute.value.value.includes('<')) {
    addError(
      errors,
      ParseErrorType.InvalidAttribute,
      `Attribute "${name}" value must not contain "<".`,
      attribute.value,
      'The parser kept the original attribute value in the AST.',
    )
  }
}

function validateElement(element: ElementNode, errors: ParseError[]): void {
  if (!isValidXMLName(element.name)) {
    addError(
      errors,
      ParseErrorType.InvalidCharacter,
      `Invalid element name "${element.name}".`,
      element,
      'The parser kept the element in the AST.',
    )
  }

  const seenNames = new Set<string>()

  for (const attribute of element.attributes) {
    validateAttribute(attribute, seenNames, errors)
  }
}

function validateComment(comment: CommentNode, errors: ParseError[]): void {
  if (comment.content.includes('--') || comment.content.endsWith('-')) {
    addError(
      errors,
      ParseErrorType.MalformedComment,
      comment.content.includes('--')
        ? 'XML comments must not contain "--".'
        : 'XML comment content must not end with "-".',
      comment,
      'The parser kept the original comment content in the AST.',
    )
  }
}

function validateProcessingInstruction(
  instruction: ProcessingInstructionNode,
  errors: ParseError[],
): void {
  if (isValidXMLName(instruction.target)) {
    if (instruction.target.toLowerCase() !== 'xml') {
      return
    }

    addError(
      errors,
      ParseErrorType.InvalidProcessingInstruction,
      'Processing-instruction target "xml" is reserved.',
      instruction,
      'The parser kept the processing instruction in the AST.',
    )
    return
  }

  addError(
    errors,
    ParseErrorType.InvalidProcessingInstruction,
    `Invalid processing-instruction target "${instruction.target}".`,
    instruction,
    'The parser kept the processing instruction in the AST.',
  )
}

function validateXMLDeclarationAttribute(
  attribute: XMLDeclarationAttributeNode,
  seenNames: Set<string>,
  errors: ParseError[],
): void {
  const name = attribute.key?.value

  if (!name || !attribute.value || !attribute.quoteChar) {
    addError(
      errors,
      ParseErrorType.InvalidXMLDeclaration,
      'XML declaration attributes must have quoted values.',
      attribute,
      'The parser kept the incomplete declaration attribute in the AST.',
    )
    return
  }

  if (seenNames.has(name)) {
    addError(
      errors,
      ParseErrorType.InvalidXMLDeclaration,
      `Duplicate XML declaration attribute "${name}".`,
      attribute,
      'The parser kept every declaration attribute in source order.',
    )
  } else {
    seenNames.add(name)
  }

  if (!['encoding', 'standalone', 'version'].includes(name)) {
    addError(
      errors,
      ParseErrorType.InvalidXMLDeclaration,
      `Unknown XML declaration attribute "${name}".`,
      attribute,
      'The parser kept the unknown declaration attribute in the AST.',
    )
    return
  }

  const value = attribute.value.value

  if (name === 'version' && value !== '1.0' && value !== '1.1') {
    addError(
      errors,
      ParseErrorType.InvalidXMLDeclaration,
      `Unsupported XML version "${value}".`,
      attribute.value,
      'The parser kept the declared version in the AST.',
    )
  }

  if (name === 'encoding' && !ENCODING_NAME_PATTERN.test(value)) {
    addError(
      errors,
      ParseErrorType.InvalidXMLDeclaration,
      `Invalid XML encoding name "${value}".`,
      attribute.value,
      'The parser kept the declared encoding in the AST.',
    )
  }

  if (name === 'standalone' && value !== 'yes' && value !== 'no') {
    addError(
      errors,
      ParseErrorType.InvalidXMLDeclaration,
      'The standalone declaration must be "yes" or "no".',
      attribute.value,
      'The parser kept the standalone value in the AST.',
    )
  }
}

function validateXMLDeclaration(
  declaration: XMLDeclarationNode,
  errors: ParseError[],
): void {
  const version = declaration.attributes[0]

  if (
    version?.key?.value !== 'version' ||
    !version.value ||
    !version.quoteChar
  ) {
    addError(
      errors,
      ParseErrorType.InvalidXMLDeclaration,
      'The XML declaration must start with a quoted version attribute.',
      declaration,
      'The parser kept the malformed XML declaration in the AST.',
    )
  }

  const seenNames = new Set<string>()
  let lastAttributeOrder = -1

  for (const attribute of declaration.attributes) {
    validateXMLDeclarationAttribute(attribute, seenNames, errors)

    const name = attribute.key?.value
    const order = name ? XML_DECLARATION_ATTRIBUTE_ORDER.get(name) : undefined

    if (order !== undefined && order < lastAttributeOrder) {
      addError(
        errors,
        ParseErrorType.InvalidXMLDeclaration,
        `XML declaration attribute "${name}" is out of order.`,
        attribute,
        'The parser kept declaration attributes in source order.',
      )
    }

    if (order !== undefined) {
      lastAttributeOrder = order
    }
  }
}

function validateDeclarationTokens(
  tokens: AnyToken[],
  root: ElementNode | undefined,
  errors: ParseError[],
): void {
  const xmlDeclarations = tokens.filter(
    token => token.type === TokenTypes.XMLDeclarationOpen,
  )

  for (const [index, token] of xmlDeclarations.entries()) {
    if (token.range[0] !== 0) {
      addError(
        errors,
        ParseErrorType.InvalidXMLDeclaration,
        'The XML declaration must be the first construct in the document.',
        token,
        'The parser kept parsing the document after the misplaced declaration.',
      )
    }

    if (index > 0) {
      addError(
        errors,
        ParseErrorType.InvalidXMLDeclaration,
        'An XML document cannot contain multiple XML declarations.',
        token,
        'The parser kept every declaration token for source inspection.',
      )
    }
  }

  const doctypes = tokens.filter(token => token.type === TokenTypes.DoctypeOpen)

  for (const [index, token] of doctypes.entries()) {
    if (root && token.range[0] > root.range[0]) {
      addError(
        errors,
        ParseErrorType.InvalidDoctype,
        'The doctype declaration must appear before the root element.',
        token,
        'The parser kept parsing after the misplaced doctype declaration.',
      )
    }

    if (index > 0) {
      addError(
        errors,
        ParseErrorType.InvalidDoctype,
        'An XML document cannot contain multiple doctype declarations.',
        token,
        'The parser kept every doctype token for source inspection.',
      )
    }
  }
}

function validateDoctype(
  doctype: DoctypeNode,
  root: ElementNode,
  errors: ParseError[],
): void {
  const declaredRoot = doctype.attributes[0]?.value?.value

  if (!declaredRoot) {
    addError(
      errors,
      ParseErrorType.InvalidDoctype,
      'A doctype declaration must name its root element.',
      doctype,
      'The parser kept the incomplete doctype in the AST.',
    )
    return
  }

  if (!isValidXMLName(declaredRoot)) {
    addError(
      errors,
      ParseErrorType.InvalidDoctype,
      `Invalid doctype root name "${declaredRoot}".`,
      doctype.attributes[0],
      'The parser kept the declared root name in the AST.',
    )
  }

  if (declaredRoot !== root.name) {
    addError(
      errors,
      ParseErrorType.InvalidDoctype,
      `Doctype root "${declaredRoot}" does not match document root "${root.name}".`,
      doctype.attributes[0],
      'The parser kept the doctype and document root unchanged.',
    )
  }
}

function validateTree(document: DocumentNode, errors: ParseError[]): void {
  const stack = [...document.children]

  while (stack.length > 0) {
    const node = stack.pop()

    if (!node) {
      continue
    }

    switch (node.type) {
      case NodeTypes.Comment:
        validateComment(node, errors)
        break
      case NodeTypes.Element:
        validateElement(node, errors)
        stack.push(...node.children)
        break
      case NodeTypes.ProcessingInstruction:
        validateProcessingInstruction(node, errors)
        break
    }
  }
}

/**
 * Validate document-level XML well-formedness after AST construction.
 */
export function validateDocument(
  document: DocumentNode,
  tokens: AnyToken[],
): ParseError[] {
  const errors: ParseError[] = []
  const roots = document.children.filter(
    node => node.type === NodeTypes.Element,
  )
  const [root] = roots

  if (root) {
    for (const extraRoot of roots.slice(1)) {
      addError(
        errors,
        ParseErrorType.InvalidDocument,
        'An XML document cannot contain multiple root elements.',
        extraRoot,
        'The parser kept every root element in source order.',
      )
    }
  } else {
    addError(
      errors,
      ParseErrorType.InvalidDocument,
      'An XML document must contain exactly one root element.',
      document,
      'The parser returned the rootless document for inspection.',
    )
  }

  for (const node of document.children) {
    if (node.type === NodeTypes.Text && node.value.trim().length > 0) {
      addError(
        errors,
        ParseErrorType.InvalidDocument,
        'Character data is not allowed outside the root element.',
        node,
        'The parser kept the top-level text node in the AST.',
      )
    } else if (node.type === NodeTypes.CDATA) {
      addError(
        errors,
        ParseErrorType.InvalidDocument,
        'CDATA sections are not allowed outside the root element.',
        node,
        'The parser kept the top-level CDATA node in the AST.',
      )
    } else if (node.type === NodeTypes.XMLDeclaration) {
      validateXMLDeclaration(node, errors)
    }
  }

  validateDeclarationTokens(tokens, root, errors)

  if (root) {
    const doctype = document.children.find(
      node => node.type === NodeTypes.Doctype,
    )

    if (doctype) {
      validateDoctype(doctype, root, errors)
    }
  }

  validateTree(document, errors)

  return errors.sort((left, right) => left.range[0] - right.range[0])
}
