import React, { createContext, useState, useEffect } from "react"

export const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState()
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    const loggin = window.localStorage.getItem("logged")
    const userName = window.localStorage.getItem("userName")
    setIsLogged(loggin ? loggin : false)
    setUser(userName ? userName : "")
  }, [user])

  return (
    <UserContext.Provider value={{ user, setUser, isLogged, setIsLogged }}>
      {children}
    </UserContext.Provider>
  )
}
