export function first<T>(items: T[]): T {
  return items[0]
}

export function last<T>(items: T[]): T {
  return items[items.length - 1]
}
