export function setAccessTokenCookie(token, maxAge = 2 * 60 * 60) {
  const expires = new Date();
  expires.setTime(expires.getTime() + maxAge * 1000);

  document.cookie = `access-token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure=${window.location.protocol === 'https:'}`;
}

export function setRefreshTokenCookie(token, maxAge = 7 * 24 * 60 * 60) {
  const expires = new Date();
  expires.setTime(expires.getTime() + maxAge * 1000);

  document.cookie = `refresh-token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure=${window.location.protocol === 'https:'}`;
}

export function setAuthTokens(accessToken, refreshToken, accessMaxAge, refreshMaxAge) {
  setAccessTokenCookie(accessToken, accessMaxAge);
  setRefreshTokenCookie(refreshToken, refreshMaxAge);
}

export function getAccessTokenCookie() {
  return getCookieValue('access-token');
}

export function getRefreshTokenCookie() {
  return getCookieValue('refresh-token');
}

export function removeAccessTokenCookie() {
  document.cookie = 'access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export function removeRefreshTokenCookie() {
  document.cookie = 'refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export function clearAuthCookies() {
  removeAccessTokenCookie();
  removeRefreshTokenCookie();
}

function getCookieValue(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

export function hasAuthCookies() {
  return !!(getAccessTokenCookie() && getRefreshTokenCookie());
}

export function setUserCookie(user) {
  const userData = JSON.stringify(user);
  const expires = new Date();
  expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 dias
  document.cookie = `user-data=${encodeURIComponent(userData)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure=${window.location.protocol === 'https:'}`;
}

export function getUserCookie() {
  const userData = getCookieValue('user-data');
  if (userData) {
    try {
      return JSON.parse(decodeURIComponent(userData));
    } catch (error) {
      console.error('Erro ao decodificar dados do usuário:', error);
      return null;
    }
  }
  return null;
}

export function removeUserCookie() {
  document.cookie = 'user-data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export function removeAuthTokens() {
  document.cookie = 'access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  removeUserCookie();
}
