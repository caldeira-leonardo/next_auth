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

export function setUserLS(user) {
  localStorage.setItem('user-data', JSON.stringify(user));
}

export function getUserLS() {
  try {
    const userData = localStorage.getItem('user-data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
}

export function removeUserLS() {
  localStorage.removeItem('user-data');
}

export function removeAuthTokens() {
  document.cookie = 'access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  removeUserLS();
}
