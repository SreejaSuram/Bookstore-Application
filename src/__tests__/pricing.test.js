import { describe, it, expect } from 'vitest'
import {
    formatINR,
    calculateShipping,
    applyCoupon,
    calculateOrderFinancials,
    FREE_SHIPPING_THRESHOLD,
    STANDARD_SHIPPING_FEE,
    VALID_COUPONS,
} from '../utils/pricing'

describe('Pricing Utilities', () => {
    it('formats INR numbers correctly with currency symbol', () => {
        expect(formatINR(499)).toContain('499')
        expect(formatINR(499)).toContain('₹')
        expect(formatINR(0)).toContain('0')
        expect(formatINR(1250)).toContain('1,250')
    })

    it('calculates shipping fee correctly based on threshold', () => {
        // 0 subtotal has 0 shipping, under ₹499 incurs standard fee
        expect(calculateShipping(0)).toBe(0)
        expect(calculateShipping(250)).toBe(STANDARD_SHIPPING_FEE)
        expect(calculateShipping(498)).toBe(STANDARD_SHIPPING_FEE)

        // ₹499 or above gets free shipping
        expect(calculateShipping(499)).toBe(0)
        expect(calculateShipping(1200)).toBe(0)
    })

    it('validates and applies coupon BOOKWORM10 (10% discount)', () => {
        const coupon = VALID_COUPONS.BOOKWORM10
        const result = applyCoupon('BOOKWORM10', 1000)

        expect(result.valid).toBe(true)
        expect(result.discount).toBe(100) // 10% of 1000
        expect(result.coupon.code).toBe('BOOKWORM10')
    })

    it('rejects invalid or non-existent coupons', () => {
        const result = applyCoupon('INVALIDCODE', 1000)
        expect(result.valid).toBe(false)
        expect(result.discount).toBe(0)
        expect(result.error).toBe('Invalid coupon code')
    })

    it('rejects coupon if minimum cart subtotal is not met', () => {
        // READMORE20 requires minAmount 999
        const result = applyCoupon('READMORE20', 500)
        expect(result.valid).toBe(false)
        expect(result.error).toContain('requires minimum cart value')
    })

    it('calculates full order financials with coupon and shipping', () => {
        // Subtotal 600, coupon BOOKWORM10 (10% = 60), shipping free (>= 499)
        const coupon = VALID_COUPONS.BOOKWORM10
        const fin = calculateOrderFinancials(600, coupon)

        expect(fin.subtotal).toBe(600)
        expect(fin.discountAmount).toBe(60)
        expect(fin.shipping).toBe(0)
        expect(fin.total).toBe(540)
    })

    it('calculates full order financials below free shipping with no coupon', () => {
        const fin = calculateOrderFinancials(300, null)
        expect(fin.subtotal).toBe(300)
        expect(fin.discountAmount).toBe(0)
        expect(fin.shipping).toBe(STANDARD_SHIPPING_FEE)
        expect(fin.total).toBe(349)
    })
})
