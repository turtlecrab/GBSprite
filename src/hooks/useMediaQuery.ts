import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    function updateMatches() {
      setMatches(mediaQuery.matches)
    }

    mediaQuery.addEventListener('change', updateMatches)
    return () => {
      mediaQuery.removeEventListener('change', updateMatches)
    }
  }, [query])

  return matches
}
