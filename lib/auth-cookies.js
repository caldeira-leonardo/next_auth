"use client"

export function setAuthTokens(accessToken, refreshToken) {
  // Access token com expiração de 2 horas
  const accessExpires = new Date()
  accessExpires.setHours(accessExpires.getHours() + 2)

  // Refresh token com expiração de 7 dias
  const refreshExpires = new Date()
  refreshExpires.setDate(refreshExpires.getDate() + 7)

  document.cookie = `access-token=${accessToken}; expires=${accessExpires.toUTCString()}; path=/; SameSite=Strict; Secure`
  document.cookie = `refresh-token=${refreshToken}; expires=${refreshExpires.toUTCString()}; path=/; SameSite=Strict; Secure`
}

export function setAccessToken(accessToken) {
  const expires = new Date()
  expires.setHours(expires.getHours() + 2)

  document.cookie = `access-token=${accessToken}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure`
}

export function removeAuthTokens() {
  document.cookie = "access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict"
  document.cookie = "refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict"
}

export function getAccessToken() {
  if (typeof document === "undefined") return null

  const cookies = document.cookie.split(";")
  const accessCookie = cookies.find((cookie) => cookie.trim().startsWith("access-token="))

  return accessCookie ? accessCookie.split("=")[1] : null
}

export function getRefreshToken() {
  if (typeof document === "undefined") return null

  const cookies = document.cookie.split(";")
  const refreshCookie = cookies.find((cookie) => cookie.trim().startsWith("refresh-token="))

  return refreshCookie ? refreshCookie.split("=")[1] : null
}

export function getAuthTokens() {
  return {
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  }
}

export function setAuthCookie(token) {
  setAccessToken(token)
}

export function removeAuthCookie() {
  removeAuthTokens()
}

export function getAuthCookie() {
  return getAccessToken()
}
