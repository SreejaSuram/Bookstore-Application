import { describe, it, expect, beforeEach } from 'vitest'
import {
    getStoredItem,
    setStoredItem,
    removeStoredItem,
    STORAGE_KEYS,
} from '../utils/storage'

describe('Storage Utilities', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('retrieves default value when key does not exist', () => {
        const val = getStoredItem('non_existent_key', { fallback: true })
        expect(val).toEqual({ fallback: true })
    })

    it('stores and retrieves serialized JSON objects correctly', () => {
        const payload = [{ id: 'book-1', title: 'Clean Code', qty: 2 }]
        setStoredItem(STORAGE_KEYS.CART, payload)

        const retrieved = getStoredItem(STORAGE_KEYS.CART, [])
        expect(retrieved).toEqual(payload)
        expect(retrieved[0].title).toBe('Clean Code')
    })

    it('handles removeStoredItem correctly', () => {
        setStoredItem(STORAGE_KEYS.ORDERS, [{ id: 'order-1' }])
        expect(getStoredItem(STORAGE_KEYS.ORDERS, [])).toHaveLength(1)

        removeStoredItem(STORAGE_KEYS.ORDERS)
        expect(getStoredItem(STORAGE_KEYS.ORDERS, [])).toEqual([])
    })

    it('gracefully recovers if localStorage contains invalid JSON string', () => {
        localStorage.setItem('corrupted_key', '{not_valid_json')
        const fallback = ['safe_default']
        const result = getStoredItem('corrupted_key', fallback)
        expect(result).toEqual(fallback)
    })
})
