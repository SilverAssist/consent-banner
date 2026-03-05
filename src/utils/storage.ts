/**
 * Storage types supported by the consent banner.
 */
export type StorageType = "localStorage" | "sessionStorage" | "cookie";

/**
 * Options for storage operations.
 */
export interface StorageOptions {
  /** Storage type to use. Defaults to "localStorage". */
  type?: StorageType;
  /** Number of days until expiry (only for cookies). Defaults to 365. */
  expiryDays?: number;
}

/**
 * Checks if we're running in a browser environment.
 */
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Gets a value from storage.
 *
 * @param key - The storage key
 * @param options - Storage options
 * @returns The stored value or null
 */
export function getStorageValue(
  key: string,
  options: StorageOptions = {},
): string | null {
  if (!isBrowser()) {
    return null;
  }

  const { type = "localStorage" } = options;

  try {
    if (type === "cookie") {
      return getCookie(key);
    }

    const storage = type === "localStorage" ? localStorage : sessionStorage;
    return storage.getItem(key);
  } catch {
    // Storage might be blocked or unavailable
    return null;
  }
}

/**
 * Sets a value in storage.
 *
 * @param key - The storage key
 * @param value - The value to store
 * @param options - Storage options
 * @returns True if successful
 */
export function setStorageValue(
  key: string,
  value: string,
  options: StorageOptions = {},
): boolean {
  if (!isBrowser()) {
    return false;
  }

  const { type = "localStorage", expiryDays = 365 } = options;

  try {
    if (type === "cookie") {
      setCookie(key, value, expiryDays);
      return true;
    }

    const storage = type === "localStorage" ? localStorage : sessionStorage;
    storage.setItem(key, value);
    return true;
  } catch {
    // Storage might be blocked or unavailable
    return false;
  }
}

/**
 * Removes a value from storage.
 *
 * @param key - The storage key
 * @param options - Storage options
 * @returns True if successful
 */
export function removeStorageValue(
  key: string,
  options: StorageOptions = {},
): boolean {
  if (!isBrowser()) {
    return false;
  }

  const { type = "localStorage" } = options;

  try {
    if (type === "cookie") {
      deleteCookie(key);
      return true;
    }

    const storage = type === "localStorage" ? localStorage : sessionStorage;
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets a cookie value by name.
 */
function getCookie(name: string): string | null {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue || "");
    }
  }

  return null;
}

/**
 * Sets a cookie with the given name, value, and expiry.
 */
function setCookie(name: string, value: string, expiryDays: number): void {
  const date = new Date();
  date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);

  const expires = `expires=${date.toUTCString()}`;
  const secure = location.protocol === "https:" ? ";Secure" : "";
  const sameSite = ";SameSite=Lax";

  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/${secure}${sameSite}`;
}

/**
 * Deletes a cookie by setting its expiry to the past.
 */
function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}
