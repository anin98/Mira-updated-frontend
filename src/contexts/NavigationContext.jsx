import { createContext, useContext, useState } from 'react'

const NavigationContext = createContext(undefined)

export function NavigationProvider({ children }) {
  const [isNavigating, setIsNavigating] = useState(false)

  const startNavigation = () => setIsNavigating(true)
  const stopNavigation = () => setIsNavigating(false)

  return (
    <NavigationContext.Provider value={{ isNavigating, startNavigation, stopNavigation }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
