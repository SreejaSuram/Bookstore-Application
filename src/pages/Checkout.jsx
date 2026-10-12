import React, { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import {
    CreditCard,
    Truck,
    ShieldCheck,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Lock,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { validateCheckoutForm } from '../utils/validation'
import { formatINR } from '../utils/pricing'
import {
    STORAGE_KEYS,
    getStoredItem,
    setStoredItem,
} from '../utils/storage'

export default function Checkout() {
    const {
        items,
        itemCount,
        subtotal,
        discountAmount,
        shipping,
        total,
        activeCoupon,
        clearCart,
    } = useCart()

    const { user } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
        paymentMethod: 'demo_cod',
    })

    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    // Prevent checking out if cart is empty (called after hooks)
    if (items.length === 0) {
        return <Navigate to="/cart" replace />
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error on edit
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const validation = validateCheckoutForm(formData)
        if (!validation.isValid) {
            setErrors(validation.errors)
            return
        }

        setSubmitting(true)

        // Simulate order processing delay
        setTimeout(() => {
            const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(
                1000 + Math.random() * 9000
            )}`

            const newOrder = {
                id: orderId,
                date: new Date().toISOString(),
                customer: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pinCode: formData.pinCode,
                },
                paymentMethod: formData.paymentMethod,
                items: [...items],
                subtotal,
                discountAmount,
                shipping,
                total,
                coupon: activeCoupon?.code || null,
                status: 'Confirmed',
                estimatedDelivery: '3 - 5 Business Days',
            }

            // Persist to LocalStorage
            const existingOrders = getStoredItem(STORAGE_KEYS.ORDERS, [])
            const updatedOrders = [newOrder, ...existingOrders]
            setStoredItem(STORAGE_KEYS.ORDERS, updatedOrders)

            // Clear shopping cart
            clearCart()

            // Redirect to success screen
            navigate(`/order-success/${orderId}`)
        }, 600)
    }

    return (
        <div className="checkout-page" style={{ padding: '2.5rem 0 5rem' }}>
            <div className="container">
                {/* Breadcrumb Navigation */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link
                        to="/cart"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                            fontWeight: 500,
                        }}
                    >
                        <ArrowLeft size={16} /> Return to Cart
                    </Link>
                </div>

                <div
                    style={{
                        marginBottom: '2rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid var(--border)',
                    }}
                >
                    <h1 className="heading-section">Checkout & Shipping</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Provide your delivery details to complete your book purchase.
                    </p>
                </div>

                {/* Demo Notice Banner */}
                <div
                    style={{
                        padding: '0.85rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--info-light)',
                        borderLeft: '4px solid var(--info)',
                        color: '#0369A1',
                        fontSize: '0.88rem',
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                    }}
                >
                    <Lock size={18} />
                    <span>
                        <strong>Demo Checkout:</strong> No real payment is charged. Order
                        data will be safely saved in your browser session for evaluation.
                    </span>
                </div>

                {/* 2-Column Form Layout */}
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '3rem',
                        alignItems: 'start',
                    }}
                    data-testid="checkout-form"
                >
                    {/* Customer & Address Form */}
                    <section aria-label="Customer contact and delivery address">
                        <h2
                            style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: '1.3rem',
                                fontWeight: 700,
                                marginBottom: '1.25rem',
                            }}
                        >
                            1. Contact & Shipping Details
                        </h2>

                        <div className="form-group">
                            <label htmlFor="fullName" className="form-label">
                                Full Name *
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="e.g. Priya Sharma"
                                className={`form-input ${errors.fullName ? 'has-error' : ''}`}
                                data-testid="checkout-name-input"
                                required
                            />
                            {errors.fullName && (
                                <span className="form-error" data-testid="error-name">
                                    <AlertCircle size={14} /> {errors.fullName}
                                </span>
                            )}
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: '1rem',
                            }}
                        >
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email Address *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    className={`form-input ${errors.email ? 'has-error' : ''}`}
                                    data-testid="checkout-email-input"
                                    required
                                />
                                {errors.email && (
                                    <span className="form-error" data-testid="error-email">
                                        <AlertCircle size={14} /> {errors.email}
                                    </span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone" className="form-label">
                                    Mobile Number (India) *
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="e.g. 9876543210"
                                    maxLength={10}
                                    className={`form-input ${errors.phone ? 'has-error' : ''}`}
                                    data-testid="checkout-phone-input"
                                    required
                                />
                                {errors.phone && (
                                    <span className="form-error" data-testid="error-phone">
                                        <AlertCircle size={14} /> {errors.phone}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address" className="form-label">
                                Street Address / House No / Landmark *
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                rows="2"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Flat / House No., Apartment, Street, Landmark"
                                className={`form-textarea ${errors.address ? 'has-error' : ''}`}
                                data-testid="checkout-address-input"
                                required
                            />
                            {errors.address && (
                                <span className="form-error" data-testid="error-address">
                                    <AlertCircle size={14} /> {errors.address}
                                </span>
                            )}
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gap: '0.75rem',
                            }}
                        >
                            <div className="form-group">
                                <label htmlFor="city" className="form-label">
                                    City *
                                </label>
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Bengaluru"
                                    className={`form-input ${errors.city ? 'has-error' : ''}`}
                                    data-testid="checkout-city-input"
                                    required
                                />
                                {errors.city && (
                                    <span className="form-error" data-testid="error-city">
                                        <AlertCircle size={14} /> {errors.city}
                                    </span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="state" className="form-label">
                                    State *
                                </label>
                                <input
                                    id="state"
                                    name="state"
                                    type="text"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="Karnataka"
                                    className={`form-input ${errors.state ? 'has-error' : ''}`}
                                    data-testid="checkout-state-input"
                                    required
                                />
                                {errors.state && (
                                    <span className="form-error" data-testid="error-state">
                                        <AlertCircle size={14} /> {errors.state}
                                    </span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="pinCode" className="form-label">
                                    PIN Code *
                                </label>
                                <input
                                    id="pinCode"
                                    name="pinCode"
                                    type="text"
                                    maxLength={6}
                                    value={formData.pinCode}
                                    onChange={handleChange}
                                    placeholder="560001"
                                    className={`form-input ${errors.pinCode ? 'has-error' : ''}`}
                                    data-testid="checkout-pin-input"
                                    required
                                />
                                {errors.pinCode && (
                                    <span className="form-error" data-testid="error-pin">
                                        <AlertCircle size={14} /> {errors.pinCode}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Payment Method Selector */}
                        <div style={{ marginTop: '1.5rem' }}>
                            <h2
                                style={{
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: '1.3rem',
                                    fontWeight: 700,
                                    marginBottom: '1rem',
                                }}
                            >
                                2. Select Demo Payment Method
                            </h2>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.75rem',
                                }}
                            >
                                {[
                                    {
                                        id: 'demo_cod',
                                        label: 'Cash on Delivery (Demo COD)',
                                        desc: 'Pay cash or UPI upon package arrival at doorstep',
                                        icon: <Truck size={20} color="var(--primary)" />,
                                    },
                                    {
                                        id: 'demo_card',
                                        label: 'Demo Card Simulation (Prepaid)',
                                        desc: 'Simulated payment transaction with instant confirmation',
                                        icon: <CreditCard size={20} color="var(--accent-teal)" />,
                                    },
                                ].map((method) => (
                                    <label
                                        key={method.id}
                                        className="card"
                                        style={{
                                            padding: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            cursor: 'pointer',
                                            border:
                                                formData.paymentMethod === method.id
                                                    ? '2px solid var(--primary)'
                                                    : '1px solid var(--border)',
                                            backgroundColor:
                                                formData.paymentMethod === method.id
                                                    ? 'var(--primary-subtle)'
                                                    : 'var(--bg-surface)',
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method.id}
                                            checked={formData.paymentMethod === method.id}
                                            onChange={handleChange}
                                            style={{ accentColor: 'var(--primary)' }}
                                        />
                                        <div style={{ flexShrink: 0 }}>{method.icon}</div>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                {method.label}
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: '0.8rem',
                                                    color: 'var(--text-muted)',
                                                }}
                                            >
                                                {method.desc}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Right Column: Order Review */}
                    <aside aria-label="Review order items and pricing">
                        <div
                            className="card"
                            style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}
                        >
                            <h3
                                style={{
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    marginBottom: '1rem',
                                    paddingBottom: '0.75rem',
                                    borderBottom: '1px solid var(--border)',
                                }}
                            >
                                Order Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                            </h3>

                            {/* Items List Mini */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.75rem',
                                    maxHeight: '220px',
                                    overflowY: 'auto',
                                    marginBottom: '1.25rem',
                                    paddingRight: '0.5rem',
                                }}
                            >
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            fontSize: '0.88rem',
                                        }}
                                    >
                                        <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                                            <p style={{ fontWeight: 600 }}>{item.title}</p>
                                            <p
                                                style={{
                                                    fontSize: '0.75rem',
                                                    color: 'var(--text-muted)',
                                                }}
                                            >
                                                Qty: {item.quantity} × {formatINR(item.price)}
                                            </p>
                                        </div>
                                        <span style={{ fontWeight: 600 }}>
                                            {formatINR(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Math breakdown */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.6rem',
                                    paddingTop: '0.75rem',
                                    borderTop: '1px solid var(--border-subtle)',
                                    fontSize: '0.9rem',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                                    <span style={{ fontWeight: 600 }}>{formatINR(subtotal)}</span>
                                </div>

                                {discountAmount > 0 && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            color: 'var(--success)',
                                        }}
                                    >
                                        <span>Coupon Discount:</span>
                                        <span style={{ fontWeight: 600 }}>
                                            -{formatINR(discountAmount)}
                                        </span>
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Shipping:</span>
                                    <span style={{ fontWeight: 600 }}>
                                        {shipping === 0 ? (
                                            <span style={{ color: 'var(--success)' }}>FREE</span>
                                        ) : (
                                            formatINR(shipping)
                                        )}
                                    </span>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        paddingTop: '0.75rem',
                                        borderTop: '1.5px dashed var(--border)',
                                        fontSize: '1.25rem',
                                        fontWeight: 800,
                                    }}
                                >
                                    <span>Total Amount:</span>
                                    <span style={{ color: 'var(--primary)' }} data-testid="checkout-final-total">
                                        {formatINR(total)}
                                    </span>
                                </div>
                            </div>

                            {/* Submit CTA */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%', marginTop: '1.5rem' }}
                                data-testid="place-order-btn"
                            >
                                {submitting ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                                        Placing Order...
                                    </span>
                                ) : (
                                    <>
                                        <CheckCircle size={20} /> Place Order ({formatINR(total)})
                                    </>
                                )}
                            </button>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    fontSize: '0.8rem',
                                    color: 'var(--text-muted)',
                                    marginTop: '1rem',
                                }}
                            >
                                <ShieldCheck size={16} color="var(--accent-teal)" />
                                <span>Simulated Order • Instant Confirmation</span>
                            </div>
                        </div>
                    </aside>
                </form>
            </div>
        </div>
    )
}
