import { useState, useEffect } from 'react'

export default (
  element: React.RefObject<Node>,
  isToggleable: boolean
): boolean => {
  const [focused, setFocused] = useState<boolean>(false)

  const clickWatcher = (e: MouseEvent) => {
    if (element && element.current) {
      const elClicked =
        e.target === element.current ||
        element.current.contains(e.target as Node)

      if (isToggleable) {
        elClicked ? setFocused(focused => !focused) : setFocused(false)
      } else {
        setFocused(elClicked)
      }
    }
  }

  useEffect(() => {
    if (element) {
      document.addEventListener('click', clickWatcher)

      return () => document.removeEventListener('click', clickWatcher)
    }
  }, [element])

  return focused
}
