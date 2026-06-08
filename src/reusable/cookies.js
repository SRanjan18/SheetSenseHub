export const AUTH_COOKIE = 'id_token';
export const SELECTED_BUSINESS = 'SELECTED_BUSINESS';

const LEGACY_APP_COOKIES = ['SHEETSENSE_AUTH', 'SHEETSENSE_SELECTED_BUSINESS'];
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 12;

export function getCookie(name) {
  if (typeof document === 'undefined') return '';

  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : '';
}

export function setCookie(name, value, maxAge = COOKIE_MAX_AGE_SECONDS) {
  if (typeof document === 'undefined') return;

  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

export function deleteCookie(name) {
  if (typeof document === 'undefined') return;

  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

export function clearLegacyAppCookies() {
  LEGACY_APP_COOKIES.forEach(deleteCookie);
}

export function clearBrowserManagedAppCookies() {
  deleteCookie(SELECTED_BUSINESS);
  clearLegacyAppCookies();
}

export function getSelectedBusinessCookie() {
  const legacySelectedBusiness = getCookie('SHEETSENSE_SELECTED_BUSINESS');
  if (legacySelectedBusiness && !getCookie(SELECTED_BUSINESS)) {
    setSelectedBusinessCookie(legacySelectedBusiness);
  }
  clearLegacyAppCookies();
  return getCookie(SELECTED_BUSINESS);
}

export function setSelectedBusinessCookie(businessName) {
  if (!businessName) {
    clearSelectedBusinessCookie();
    return;
  }

  setCookie(SELECTED_BUSINESS, businessName);
  clearLegacyAppCookies();
}

export function clearSelectedBusinessCookie() {
  deleteCookie(SELECTED_BUSINESS);
  clearLegacyAppCookies();
}
