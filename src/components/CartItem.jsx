import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { formatINR } from '../utils/pricing'
import { useCart } from '../context/CartContext'
import { FALLBACK_BOOK_COVER } from '../data/books'

export default function CartItem({ item }) {
    const { updateQuantity, removeFromCart } = useCart()
    const [imageSrc, setImageSrc] = useState(item.coverImage)

    const handleDecrease = () => {
        updateQuantity(item.id, item.quantity - 1)
    }

    const handleIncrease = () => {
        updateQuantity(item.id, item.quantity + 1)
    }

    const handleDirectChange = (e) => {
        const val = parseInt(e.target.value, 10)
        if (!isNaN(val)) {
            updateQuantity(item.id, val)
        }
    }

    const itemSubtotal = item.price * item.quantity
    const isMaxStock = item.stock && item.quantity >= item.stock

    return (
        <div
            className="card"
            style={{
                padding: '1.25rem',
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                gap: '1.25rem',
                alignItems: 'center',
                marginBottom: '1rem',
            }}
            data-testid={`cart-item-${item.id}`}
        >
            <Link
                to={`/books/${item.id}`}
                style={{
                    width: '80px',
                    height: '115px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    display: 'block',
                    flexShrink: 0,
                }}
            >
                <img
                    src={imageSrc}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={() => setImageSrc(FALLBACK_BOOK_COVER)}
                />
            </Link>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <span
                    style={{
                        fontSize: '0.75rem',
                        color: 'var(--accent-teal)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                    }}
                >
                    {item.category}
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3 }}>
                    <Link to={`/books/${item.id}`} style={{ color: 'var(--text-main)' }}>
                        {item.title}
                    </Link>
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    by {item.author}
                </p>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginTop: '0.25rem',
                    }}
                >
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {formatINR(item.price)} each
                    </span>
                    {item.stock && item.quantity >= item.stock && (
                        <span
                            style={{
                                fontSize: '0.75rem',
                                color: 'var(--warning)',
                                fontWeight: 600,
                            }}
                        >
                            (Max stock reached)
                        </span>
                    )}
                </div>

                {/* Quantity Stepper */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '0.5rem',
                    }}
                >
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            border: '1.5px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            backgroundColor: 'var(--bg-surface)',
                        }}
                    >
                        <button
                            type="button"
                            onClick={handleDecrease}
                            aria-label={`Decrease quantity of ${item.title}`}
                            data-testid={`decrease-qty-${item.id}`}
                            style={{
                                padding: '0.4rem 0.65rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-main)',
                                backgroundColor: 'var(--bg-surface-subtle)',
                            }}
                        >
                            <Minus size={14} />
                        </button>
                        <input
                            type="number"
                            min="1"
                            max={item.stock || 99}
                            value={item.quantity}
                            onChange={handleDirectChange}
                            aria-label={`Quantity for ${item.title}`}
                            data-testid={`quantity-input-${item.id}`}
                            style={{
                                width: '44px',
                                textAlign: 'center',
                                border: 'none',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                outline: 'none',
                                MozAppearance: 'textfield',
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleIncrease}
                            disabled={isMaxStock}
                            aria-label={`Increase quantity of ${item.title}`}
                            data-testid={`increase-qty-${item.id}`}
                            style={{
                                padding: '0.4rem 0.65rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-main)',
                                backgroundColor: isMaxStock
                                    ? 'var(--border-subtle)'
                                    : 'var(--bg-surface-subtle)',
                                cursor: isMaxStock ? 'not-allowed' : 'pointer',
                            }}
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="btn-icon"
                        style={{ color: 'var(--danger)', padding: '0.4rem' }}
                        aria-label={`Remove ${item.title} from cart`}
                        data-testid={`remove-item-${item.id}`}
                        title="Remove item"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div style={{ textAlign: 'right', justifySelf: 'end' }}>
                <div
                    style={{
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                    }}
                    data-testid={`item-subtotal-${item.id}`}
                >
                    {formatINR(itemSubtotal)}
                </div>
            </div>
        </div>
    )
}
