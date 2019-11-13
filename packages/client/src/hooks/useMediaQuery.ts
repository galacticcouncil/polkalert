import { useState, useEffect } from 'react'

export default (query: string): boolean => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    const windowResized = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', windowResized)

    return () => window.removeEventListener('resize', windowResized)
  }, [])

  useEffect(() => {
    setMatches(window.matchMedia(query).matches)
  }, [query, windowWidth])

  return matches
}
