/**
 * Safe LocalStorage utility functions with JSON parsing and fallback error handling
 */

export const STORAGE_KEYS = {
    CART: 'bookstore_cart',
    ORDERS: 'bookstore_orders',
    AUTH: 'bookstore_auth_user',
    USERS: 'bookstore_demo_users',
}

export function getStoredItem(key, defaultValue = null) {
    try {
        const raw = localStorage.getItem(key)
        if (!raw) return defaultValue
        return JSON.parse(raw)
    } catch (err) {
        console.warn(`Error reading localStorage key "${key}":`, err)
        return defaultValue
    }
}

export function setStoredItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value))
        return true
    } catch (err) {
        console.warn(`Error saving to localStorage key "${key}":`, err)
        return false
    }
}

export function removeStoredItem(key) {
    try {
        localStorage.removeItem(key)
        return true
    } catch (err) {
        console.warn(`Error removing localStorage key "${key}":`, err)
        return false
    }
}
