import React from 'react'
import { Link } from 'react-router-dom'
import { Package, Calendar, MapPin, ArrowRight, BookOpen } from 'lucide-react'
import { STORAGE_KEYS, getStoredItem } from '../utils/storage'
import { formatINR } from '../utils/pricing'

export default function Orders() {
    const orders = getStoredItem(STORAGE_KEYS.ORDERS, [])

    if (orders.length === 0) {
        return (
            <div className="orders-page" style={{ padding: '4rem 0 6rem' }}>
                <div className="container">
                    <div
                        className="empty-state"
                        style={{ maxWidth: '580px', margin: '0 auto' }}
                        data-testid="no-orders-state"
                    >
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--primary-subtle)',
                                color: 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                            }}
                        >
                            <Package size={40} />
                        </div>
                        <h2 className="empty-state-title">No orders placed yet</h2>
                        <p className="empty-state-desc">
                            When you complete a purchase, your order history and live status
                            will appear right here. Start browsing our catalog to pick your
                            next book!
                        </p>
                        <Link
                            to="/books"
                            className="btn btn-primary btn-lg"
                            data-testid="start-shopping-orders-btn"
                        >
                            <BookOpen size={18} /> Browse Book Collection
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="orders-page" style={{ padding: '2.5rem 0 5rem' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div
                    style={{
                        marginBottom: '2rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid var(--border)',
                    }}
                >
                    <h1 className="heading-section">Your Order History</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Track and view receipts for all your book purchases ({orders.length}{' '}
                        {orders.length === 1 ? 'order' : 'orders'}).
                    </p>
                </div>

                <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                    data-testid="orders-list-container"
                >
                    {orders.map((order) => {
                        const orderDate = new Date(order.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        })

                        const totalItemCount = order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                        )

                        return (
                            <div
                                key={order.id}
                                className="card"
                                style={{ padding: '1.75rem' }}
                                data-testid={`order-card-${order.id}`}
                            >
                                {/* Order Top Bar */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        gap: '1rem',
                                        marginBottom: '1.25rem',
                                        paddingBottom: '1rem',
                                        borderBottom: '1px solid var(--border-subtle)',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div
                                            style={{
                                                padding: '0.5rem',
                                                borderRadius: 'var(--radius-md)',
                                                backgroundColor: 'var(--primary-subtle)',
                                                color: 'var(--primary)',
                                            }}
                                        >
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                                                {order.id}
                                            </h3>
                                            <p
                                                style={{
                                                    fontSize: '0.8rem',
                                                    color: 'var(--text-muted)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                }}
                                            >
                                                <Calendar size={13} /> Placed on {orderDate}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                        }}
                                    >
                                        <span className="badge badge-teal">
                                            {order.status || 'Confirmed'}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: '1.2rem',
                                                fontWeight: 800,
                                                color: 'var(--primary)',
                                            }}
                                        >
                                            {formatINR(order.total)}
                                        </span>
                                    </div>
                                </div>

                                {/* Items Preview */}
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        overflowX: 'auto',
                                        paddingBottom: '0.75rem',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                minWidth: '220px',
                                                padding: '0.5rem 0.75rem',
                                                backgroundColor: 'var(--bg-surface-subtle)',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1px solid var(--border-subtle)',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '34px',
                                                    height: '48px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    overflow: 'hidden',
                                                    backgroundColor: '#E7E5E4',
                                                    flexShrink: 0,
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
                                            <div style={{ overflow: 'hidden' }}>
                                                <p
                                                    style={{
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600,
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {item.title}
                                                </p>
                                                <p
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        color: 'var(--text-muted)',
                                                    }}
                                                >
                                                    Qty: {item.quantity} • {formatINR(item.price)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Shipping & Action */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        gap: '1rem',
                                        fontSize: '0.85rem',
                                        color: 'var(--text-muted)',
                                        paddingTop: '0.75rem',
                                        borderTop: '1px solid var(--border-subtle)',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={15} color="var(--primary)" />
                                        <span>
                                            Shipping to <strong>{order.customer.fullName}</strong>,{' '}
                                            {order.customer.city} ({order.customer.pinCode})
                                        </span>
                                    </div>

                                    <Link
                                        to={`/order-success/${order.id}`}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontWeight: 600,
                                            color: 'var(--primary)',
                                        }}
                                    >
                                        View Receipt & Details <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
