import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ShoppingBag,
    Trash2,
    ArrowLeft,
    ArrowRight,
    AlertTriangle,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'
import OrderSummary from '../components/OrderSummary'
import Modal from '../components/Modal'

export default function Cart() {
    const { items, clearCart, itemCount } = useCart()
    const [showClearModal, setShowClearModal] = useState(false)

    const handleConfirmClear = () => {
        clearCart()
        setShowClearModal(false)
    }

    if (items.length === 0) {
        return (
            <div className="cart-page" style={{ padding: '4rem 0 6rem' }}>
                <div className="container">
                    <div
                        className="empty-state"
                        style={{ maxWidth: '580px', margin: '0 auto' }}
                        data-testid="empty-cart-state"
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
                            <ShoppingBag size={40} />
                        </div>
                        <h2 className="empty-state-title">Your shopping cart is empty</h2>
                        <p className="empty-state-desc">
                            Looks like you haven't discovered your next great read yet. Browse
                            our curated catalog to fill your shelves!
                        </p>
                        <Link
                            to="/books"
                            className="btn btn-primary btn-lg"
                            data-testid="continue-shopping-btn"
                        >
                            <ArrowLeft size={18} /> Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="cart-page" style={{ padding: '2.5rem 0 5rem' }}>
            <div className="container">
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '2rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid var(--border)',
                        flexWrap: 'wrap',
                        gap: '1rem',
                    }}
                >
                    <div>
                        <h1 className="heading-section">Shopping Cart</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Review your items and proceed to secure checkout. ({itemCount}{' '}
                            {itemCount === 1 ? 'item' : 'items'})
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowClearModal(true)}
                        className="btn btn-danger-outline btn-sm"
                        data-testid="clear-cart-btn"
                    >
                        <Trash2 size={16} /> Clear Cart
                    </button>
                </div>

                {/* Layout: Cart Items Grid + Order Summary */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '2.5rem',
                        alignItems: 'start',
                    }}
                    className="cart-grid-layout"
                >
                    {/* Items Column */}
                    <section aria-label="Cart items list">
                        <div data-testid="cart-items-list">
                            {items.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>

                        <div
                            style={{
                                marginTop: '1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Link
                                to="/books"
                                className="btn btn-secondary btn-sm"
                                style={{ borderRadius: 'var(--radius-full)' }}
                            >
                                <ArrowLeft size={16} /> Back to Shopping
                            </Link>
                        </div>
                    </section>

                    {/* Summary Column */}
                    <aside aria-label="Order calculations">
                        <OrderSummary showCheckoutBtn={true} />
                    </aside>
                </div>
            </div>

            {/* Confirmation Modal for Clearing Cart */}
            <Modal
                isOpen={showClearModal}
                onClose={() => setShowClearModal(false)}
                title="Clear Shopping Cart"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowClearModal(false)}
                            className="btn btn-secondary btn-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmClear}
                            className="btn btn-danger btn-sm"
                            data-testid="confirm-clear-cart-btn"
                        >
                            Yes, Clear Cart
                        </button>
                    </>
                }
            >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div
                        style={{
                            padding: '0.6rem',
                            backgroundColor: 'var(--danger-light)',
                            borderRadius: '50%',
                            color: 'var(--danger)',
                        }}
                    >
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p style={{ fontWeight: 600, marginBottom: '0.35rem' }}>
                            Are you sure you want to remove all books from your cart?
                        </p>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                            This action cannot be undone. You will need to re-add your
                            selected titles from the catalogue.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
