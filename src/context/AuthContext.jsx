import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(
        'userInfo'
      )

      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.log(error)
      localStorage.removeItem('userInfo')
      setUser(null)
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const login = (userData) => {
    localStorage.setItem(
      'userInfo',
      JSON.stringify(userData)
    )

    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('userInfo')
    setUser(null)
  }

  const updateUser = (updatedData) => {
    setUser((currentUser) => {
      const updatedUser = {
        ...currentUser,
        ...updatedData,
      }

      localStorage.setItem(
        'userInfo',
        JSON.stringify(updatedUser)
      )

      return updatedUser
    })
  }

  const value = useMemo(() => {
    return {
      user,
      setUser,
      login,
      logout,
      updateUser,
      authLoading,
    }
  }, [user, authLoading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}