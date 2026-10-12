import React from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    CheckCircle2,
    Package,
    Calendar,
    MapPin,
    ArrowRight,
    BookOpen,
} from 'lucide-react'
import { STORAGE_KEYS, getStoredItem } from '../utils/storage'
import { formatINR } from '../utils/pricing'

export default function OrderSuccess() {
    const { orderId } = useParams()
    const orders = getStoredItem(STORAGE_KEYS.ORDERS, [])
    const order = orders.find((o) => o.id === orderId)

    // Fallback if order record is not found in localStorage
    if (!order) {
        return (
            <div className="container" style={{ padding: '4rem 0' }}>
                <div className="empty-state">
                    <Package className="empty-state-icon" />
                    <h2 className="empty-state-title">Order Information Not Found</h2>
                    <p className="empty-state-desc">
                        We couldn't locate order records for "{orderId}". You can check your
                        order history or browse the store.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/orders" className="btn btn-secondary">
                            View Order History
                        </Link>
                        <Link to="/books" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const orderDate = new Date(order.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <div className="order-success-page" style={{ padding: '3rem 0 6rem' }}>
            <div className="container" style={{ maxWidth: '820px' }}>
                {/* Success Header Banner */}
                <div
                    className="card"
                    style={{
                        padding: '2.5rem 2rem',
                        textAlign: 'center',
                        marginBottom: '2rem',
                        borderTop: '6px solid var(--success)',
                    }}
                    data-testid="order-success-card"
                >
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--success-light)',
                            color: 'var(--success)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.25rem',
                        }}
                    >
                        <CheckCircle2 size={38} />
                    </div>

                    <h1
                        className="heading-section"
                        style={{ marginBottom: '0.5rem', color: '#15803D' }}
                    >
                        Order Placed Successfully!
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                        Thank you for ordering with BookHaven. Your order has been
                        confirmed.
                    </p>

                    <div
                        style={{
                            marginTop: '1.5rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.5rem 1.25rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--bg-surface-subtle)',
                            border: '1px solid var(--border)',
                            fontSize: '0.95rem',
                        }}
                    >
                        <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                        <strong data-testid="order-id-display">{order.id}</strong>
                    </div>
                </div>

                {/* Order Details & Summary Card */}
                <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2
                        style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            marginBottom: '1.5rem',
                            paddingBottom: '0.75rem',
                            borderBottom: '1px solid var(--border)',
                        }}
                    >
                        Order Receipt & Delivery Summary
                    </h2>

                    {/* Metadata Row */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '2rem',
                            padding: '1.25rem',
                            backgroundColor: 'var(--bg-surface-subtle)',
                            borderRadius: 'var(--radius-md)',
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    marginBottom: '4px',
                                }}
                            >
                                <Calendar size={14} /> Order Date
                            </p>
                            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{orderDate}</p>
                        </div>

                        <div>
                            <p
                                style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    marginBottom: '4px',
                                }}
                            >
                                <Package size={14} /> Estimated Delivery
                            </p>
                            <p
                                style={{
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    color: 'var(--accent-teal)',
                                }}
                            >
                                {order.estimatedDelivery}
                            </p>
                        </div>

                        <div>
                            <p
                                style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    marginBottom: '4px',
                                }}
                            >
                                <MapPin size={14} /> Deliver To
                            </p>
                            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                {order.customer.fullName} ({order.customer.city})
                            </p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {order.customer.address}, PIN: {order.customer.pinCode}
                            </p>
                        </div>
                    </div>

                    {/* Purchased Items List */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3
                            style={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                marginBottom: '1rem',
                                color: 'var(--text-main)',
                            }}
                        >
                            Purchased Books ({order.items.length})
                        </h3>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                            }}
                        >
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 1rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-subtle)',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div
                                            style={{
                                                width: '40px',
                                                height: '56px',
                                                borderRadius: 'var(--radius-sm)',
                                                overflow: 'hidden',
                                                backgroundColor: 'var(--bg-surface-subtle)',
                                            }}
                                        >
                                            <img
                                                src={item.coverImage}
                                                alt={item.title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                {item.title}
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: '0.8rem',
                                                    color: 'var(--text-muted)',
                                                }}
                                            >
                                                Qty: {item.quantity} × {formatINR(item.price)}
                                            </p>
                                        </div>
                                    </div>
                                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                                        {formatINR(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Financial Summary */}
                    <div
                        style={{
                            paddingTop: '1rem',
                            borderTop: '1px solid var(--border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.6rem',
                            fontSize: '0.95rem',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal:</span>
                            <span style={{ fontWeight: 600 }}>{formatINR(order.subtotal)}</span>
                        </div>

                        {order.discountAmount > 0 && (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    color: 'var(--success)',
                                }}
                            >
                                <span>Coupon Discount ({order.coupon}):</span>
                                <span style={{ fontWeight: 600 }}>
                                    -{formatINR(order.discountAmount)}
                                </span>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Shipping:</span>
                            <span style={{ fontWeight: 600 }}>
                                {order.shipping === 0 ? (
                                    <span style={{ color: 'var(--success)' }}>FREE</span>
                                ) : (
                                    formatINR(order.shipping)
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
                            <span>Total Paid:</span>
                            <span style={{ color: 'var(--primary)' }}>
                                {formatINR(order.total)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action CTAs */}
                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <Link
                        to="/orders"
                        className="btn btn-secondary btn-lg"
                        data-testid="view-orders-btn"
                    >
                        <Package size={18} /> View All Orders
                    </Link>
                    <Link
                        to="/books"
                        className="btn btn-primary btn-lg"
                        data-testid="continue-shopping-success-btn"
                    >
                        <BookOpen size={18} /> Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    )
}
