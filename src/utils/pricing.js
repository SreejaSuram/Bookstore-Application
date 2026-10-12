/**
 * Pricing, Currency formatting, and calculation utilities for Indian Rupee (INR - ₹)
 */

export const FREE_SHIPPING_THRESHOLD = 499
export const STANDARD_SHIPPING_FEE = 49

export const VALID_COUPONS = {
    BOOKWORM10: {
        code: 'BOOKWORM10',
        type: 'percent',
        discount: 10,
        minAmount: 0,
        description: '10% off on your entire book order',
    },
    READMORE20: {
        code: 'READMORE20',
        type: 'percent',
        discount: 20,
        minAmount: 800,
        description: '20% off on orders above ₹800',
    },
    FESTIVE50: {
        code: 'FESTIVE50',
        type: 'flat',
        discount: 50,
        minAmount: 300,
        description: 'Flat ₹50 off on orders above ₹300',
    },
}

/**
 * Formats a number as Indian Rupee (e.g. ₹1,299 or ₹450)
 */
export function formatINR(amount) {
    const num = Number(amount) || 0
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(num)
}

/**
 * Calculates shipping charge based on subtotal.
 * Free delivery for orders >= ₹499, otherwise ₹49.
 */
export function calculateShipping(subtotal) {
    if (!subtotal || subtotal <= 0) return 0
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE
}

/**
 * Validates a promo coupon code against current subtotal
 */
export function validateCoupon(code, subtotal) {
    if (!code || typeof code !== 'string') {
        return { valid: false, message: 'Please enter a coupon code' }
    }

    const normalized = code.trim().toUpperCase()
    const coupon = VALID_COUPONS[normalized]

    if (!coupon) {
        return {
            valid: false,
            message: 'Invalid coupon code. Try BOOKWORM10, READMORE20, or FESTIVE50',
        }
    }

    if (coupon.minAmount && subtotal < coupon.minAmount) {
        return {
            valid: false,
            message: `Coupon ${coupon.code} requires a minimum order of ${formatINR(coupon.minAmount)}`,
        }
    }

    return {
        valid: true,
        coupon,
        message: `Coupon ${coupon.code} applied successfully!`,
    }
}

/**
 * Computes discount amount based on coupon and subtotal
 */
export function calculateDiscount(coupon, subtotal) {
    if (!coupon || !subtotal || subtotal <= 0) return 0

    if (coupon.type === 'percent') {
        return Math.round((subtotal * coupon.discount) / 100)
    }

    if (coupon.type === 'flat') {
        return Math.min(coupon.discount, subtotal)
    }

    return 0
}

/**
 * Computes complete cart / order breakdown
 */
export function calculateCartTotals(items = [], activeCoupon = null) {
    const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0)
    const subtotal = items.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
    )

    const discountAmount = calculateDiscount(activeCoupon, subtotal)
    const discountedSubtotal = Math.max(0, subtotal - discountAmount)
    const shipping = calculateShipping(discountedSubtotal)
    const total = discountedSubtotal + shipping

    return {
        itemCount,
        subtotal,
        discountAmount,
        discountedSubtotal,
        shipping,
        total,
        isFreeShipping: shipping === 0 && subtotal > 0,
        amountNeededForFreeShipping:
            subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD
                ? FREE_SHIPPING_THRESHOLD - subtotal
                : 0,
    }
}
