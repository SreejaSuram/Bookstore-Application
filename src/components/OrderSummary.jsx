import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tag, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import {
    formatINR,
    FREE_SHIPPING_THRESHOLD,
    STANDARD_SHIPPING_FEE,
} from '../utils/pricing'
import { useCart } from '../context/CartContext'

export default function OrderSummary({ showCheckoutBtn = true }) {
    const {
        itemCount,
        subtotal,
        discountAmount,
        discountedSubtotal,
        shipping,
        total,
        activeCoupon,
        applyCoupon,
        removeCoupon,
        isFreeShipping,
        amountNeededForFreeShipping,
    } = useCart()

    const [couponInput, setCouponInput] = useState('')
    const [couponLoading, setCouponLoading] = useState(false)
    const [couponMsg, setCouponMsg] = useState(null)

    const handleApplyCoupon = (e) => {
        e.preventDefault()
        if (!couponInput.trim()) return

        setCouponLoading(true)
        setCouponMsg(null)

        setTimeout(() => {
            const res = applyCoupon(couponInput.trim())
            setCouponMsg(res)
            setCouponLoading(false)
            if (res.success) {
                setCouponInput('')
            }
        }, 200)
    }

    return (
        <div
            className="card"
            style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}
            aria-label="Order financial summary"
            data-testid="order-summary"
        >
            <h3
                style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    marginBottom: '1.25rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid var(--border)',
                }}
            >
                Order Summary
            </h3>

            {/* Free shipping progress notification */}
            {subtotal > 0 && (
                <div
                    style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isFreeShipping
                            ? 'var(--accent-teal-subtle)'
                            : 'var(--primary-subtle)',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        color: isFreeShipping
                            ? 'var(--accent-teal-hover)'
                            : 'var(--primary-hover)',
                    }}
                >
                    <Truck size={18} />
                    {isFreeShipping ? (
                        <span>
                            <strong>Congratulations!</strong> You unlocked FREE Shipping!
                        </span>
                    ) : (
                        <span>
                            Add <strong>{formatINR(amountNeededForFreeShipping)}</strong> more
                            for <strong>FREE Shipping</strong> (Threshold: {formatINR(FREE_SHIPPING_THRESHOLD)})
                        </span>
                    )}
                </div>
            )}

            {/* Breakdown lines */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                    marginBottom: '1.5rem',
                    fontSize: '0.95rem',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                        Items Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}):
                    </span>
                    <span style={{ fontWeight: 600 }} data-testid="summary-subtotal">
                        {formatINR(subtotal)}
                    </span>
                </div>

                {discountAmount > 0 && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            color: 'var(--success)',
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Tag size={14} /> Coupon ({activeCoupon?.code}):
                        </span>
                        <span style={{ fontWeight: 600 }} data-testid="summary-discount">
                            -{formatINR(discountAmount)}
                        </span>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Delivery Charges:</span>
                    <span style={{ fontWeight: 600 }} data-testid="summary-shipping">
                        {shipping === 0 ? (
                            <span style={{ color: 'var(--success)' }}>FREE</span>
                        ) : (
                            formatINR(shipping)
                        )}
                    </span>
                </div>

                <div
                    style={{
                        borderTop: '1.5px dashed var(--border)',
                        paddingTop: '0.85rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                    }}
                >
                    <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                        Total Amount:
                    </span>
                    <span
                        style={{
                            fontSize: '1.45rem',
                            fontWeight: 800,
                            color: 'var(--primary)',
                        }}
                        data-testid="summary-total"
                    >
                        {formatINR(total)}
                    </span>
                </div>
            </div>

            {/* Coupon Application Box */}
            <div
                style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-subtle)',
                }}
            >
                {activeCoupon ? (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.88rem',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Tag size={16} color="var(--accent-teal)" />
                            <div>
                                <strong>{activeCoupon.code}</strong>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {activeCoupon.description}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={removeCoupon}
                            className="btn btn-sm btn-danger-outline"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            data-testid="remove-coupon-btn"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleApplyCoupon}>
                        <label
                            htmlFor="coupon-code-input"
                            style={{
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                display: 'block',
                                marginBottom: '0.4rem',
                            }}
                        >
                            Apply Discount Coupon
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                id="coupon-code-input"
                                type="text"
                                placeholder="e.g. BOOKWORM10"
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                className="form-input"
                                style={{
                                    padding: '0.45rem 0.75rem',
                                    fontSize: '0.85rem',
                                    textTransform: 'uppercase',
                                }}
                                data-testid="coupon-input"
                            />
                            <button
                                type="submit"
                                disabled={couponLoading || !couponInput.trim()}
                                className="btn btn-secondary btn-sm"
                                data-testid="apply-coupon-btn"
                            >
                                Apply
                            </button>
                        </div>
                        {couponMsg && (
                            <p
                                style={{
                                    fontSize: '0.78rem',
                                    marginTop: '0.4rem',
                                    color: couponMsg.success ? 'var(--success)' : 'var(--danger)',
                                }}
                            >
                                {couponMsg.message}
                            </p>
                        )}
                        <div
                            style={{
                                display: 'flex',
                                gap: '0.4rem',
                                marginTop: '0.5rem',
                                flexWrap: 'wrap',
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => setCouponInput('BOOKWORM10')}
                                className="badge badge-amber"
                                style={{ cursor: 'pointer', border: 'none' }}
                            >
                                BOOKWORM10 (10% off)
                            </button>
                            <button
                                type="button"
                                onClick={() => setCouponInput('FESTIVE50')}
                                className="badge badge-teal"
                                style={{ cursor: 'pointer', border: 'none' }}
                            >
                                FESTIVE50 (₹50 off)
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Checkout CTA Button */}
            {showCheckoutBtn && (
                <Link
                    to="/checkout"
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginBottom: '1rem' }}
                    data-testid="proceed-to-checkout-btn"
                >
                    Proceed to Checkout <ArrowRight size={18} />
                </Link>
            )}

            {/* Trust & Guarantee */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                }}
            >
                <ShieldCheck size={16} color="var(--accent-teal)" />
                <span>Safe & Encrypted Checkout • Demo Store</span>
            </div>
        </div>
    )
}
