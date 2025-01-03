/**
 * Scroll given target into view if it's not visible
 * @param target
 */
export function scrollIntoViewIfNeeded(target: Element) {
  const rect = target.getBoundingClientRect()
  const isBelow = rect.top < 0
  const isAbove = rect.bottom > window.innerHeight

  if ((isAbove && isBelow) || rect.height > window.innerHeight) {
    return target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    })
  }

  // outside from the view
  if (isAbove || isBelow) {
    return target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
  }
}
