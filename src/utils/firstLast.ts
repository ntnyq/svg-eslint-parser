/**
 * Get the first element of an array
 * @param items - Array to get first element from
 * @returns First element of the array
 */
export function first<T>(items: T[]): T {
  return items[0]
}

/**
 * Get the last element of an array
 * @param items - Array to get last element from
 * @returns Last element of the array
 */
export function last<T>(items: T[]): T {
  return items[items.length - 1]
}
