"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  sendVerificationCode,
  verifyCodeAndLogin,
  refreshAccessToken,
  validateAccessToken,
  getTokensFromStorage,
  saveTokensToStorage,
  removeTokensFromStorage,
  getUserFromStorage,
  saveUserToStorage,
  removeUserFromStorage,
} from "@/lib/auth"
import { setAuthTokens, removeAuthTokens } from "@/lib/auth-cookies"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    const storedUser = getUserFromStorage()
    const tokens = getTokensFromStorage()

    if (storedUser && tokens?.accessToken) {
      const validation = validateAccessToken(tokens.accessToken)

      if (validation.valid) {
        setUser(storedUser)
        setAuthTokens(tokens.accessToken, tokens.refreshToken)
      } else if (tokens.refreshToken) {
        // Tenta renovar o token
        const renewed = await attemptTokenRenewal(tokens.refreshToken)
        if (renewed) {
          setUser(storedUser)
        } else {
          logout()
        }
      } else {
        // Sem tokens válidos, faz logout
        logout()
      }
    }

    setIsLoading(false)
  }

  const attemptTokenRenewal = async (refreshToken) => {
    try {
      const refreshResult = await refreshAccessToken(refreshToken)
      saveTokensToStorage(refreshResult.accessToken, refreshToken)
      setAuthTokens(refreshResult.accessToken, refreshToken)
      return true
    } catch (error) {
      console.error("Falha na renovação automática:", error)
      return false
    }
  }

  const sendCode = async (email) => {
    setIsLoading(true)
    console.log("[v0] AuthContext sendCode chamado com:", email)

    try {
      const result = await sendVerificationCode(email)
      console.log("[v0] sendVerificationCode resultado:", result)
      return true
    } catch (error) {
      console.error("[v0] Erro ao enviar código:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const verifyCode = async (email, code) => {
    setIsLoading(true)
    try {
      const result = await verifyCodeAndLogin(email, code)

      setUser(result.user)
      saveUserToStorage(result.user)
      saveTokensToStorage(result.accessToken, result.refreshToken)
      setAuthTokens(result.accessToken, result.refreshToken)

      return true
    } catch (error) {
      console.error("Erro ao verificar código:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const renewToken = async () => {
    const tokens = getTokensFromStorage()

    if (!tokens?.refreshToken) {
      return false
    }

    if (tokens.accessToken) {
      const validation = validateAccessToken(tokens.accessToken)
      if (validation.valid) {
        return true // Token ainda válido, não precisa renovar
      }
    }

    return await attemptTokenRenewal(tokens.refreshToken)
  }

  const logout = () => {
    setUser(null)
    removeUserFromStorage()
    removeTokensFromStorage()
    removeAuthTokens()
  }

  const isAuthenticated = () => {
    return !!user
  }

  const getCurrentUser = () => {
    return user
  }

  // Mantém compatibilidade com sistema anterior
  const login = async (email, password) => {
    // Esta função não é mais usada, mas mantida para compatibilidade
    return false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        sendCode,
        verifyCode,
        renewToken,
        logout,
        isLoading,
        isAuthenticated,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
