import { createContext, useReducer } from 'react'

export const ThemeContext = createContext()

function themeReducer(state, action) {
  if (action.type === 'TOGGLE') {
    return state === 'light' ? 'dark' : 'light'
  }
  return state
}

export function ThemeProvider({ children }) {
  const [theme, dispatch] = useReducer(themeReducer, 'light')

  return (
    <ThemeContext.Provider value={{ theme, dispatch }}>
      {children}
    </ThemeContext.Provider>
  )
}
