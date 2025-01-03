import { isFunction, isNumber, isObject, isUndefined } from '@ntnyq/utils'
import type { ParentNodeType } from './types'

export function isSVGNode(value: Record<string, any>) {
  return 'type' in value && 'loc' in value && 'range' in value
}

export function getTooltipLabel(
  value: unknown,
  propName?: string,
  parentType?: ParentNodeType,
): string | undefined {
  if (isNumber(value)) {
    switch (parentType) {
      case 'svgNode':
        return propName
    }
  }

  return undefined
}

export function getNodeType(value: unknown): ParentNodeType {
  if (isObject(value) && isSVGNode(value)) {
    return 'svgNode'
  }
  return undefined
}

export function getTypeName(
  value: Record<string, unknown>,
  valueType: ParentNodeType,
): string | undefined {
  switch (valueType) {
    case 'svgNode':
      return String(value.type)

    // extends
  }
  return undefined
}

export function filterProperties(
  key: string,
  value: unknown,
  type: ParentNodeType,
  showTokens?: boolean,
): boolean {
  if (isUndefined(value) || isFunction(value) || key.startsWith('_')) {
    return false
  }

  switch (type) {
    case 'svgNode':
      return key !== 'tokens' || !showTokens
  }

  return true
}
