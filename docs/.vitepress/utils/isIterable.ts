import { isFunction, isObject } from '@ntnyq/utils'

export function isIterable(value: unknown) {
  return isObject(value) && Symbol.iterator in value && isFunction(value[Symbol.iterator])
}
