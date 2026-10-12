import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider, useCart } from '../context/CartContext'

// Test Consumer Component
function TestCartConsumer({ sampleBook }) {
    const {
        items,
        itemCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCouponCode,
        activeCoupon,
        discountAmount,
        total,
    } = useCart()

    return (
        <div>
            <div data-testid="cart-count">{itemCount}</div>
            <div data-testid="cart-subtotal">{subtotal}</div>
            <div data-testid="cart-total">{total}</div>
            <div data-testid="discount-amount">{discountAmount}</div>
            <div data-testid="coupon-code">{activeCoupon?.code || 'NONE'}</div>

            <button
                onClick={() => addToCart(sampleBook, 1)}
                data-testid="add-sample-btn"
            >
                Add Book
            </button>

            <button
                onClick={() => addToCart(sampleBook, 999)} // Exceeds stock (sampleBook.stock = 5)
                data-testid="add-exceed-btn"
            >
                Add Over Stock
            </button>

            {items.map((item) => (
                <div key={item.id} data-testid={`item-${item.id}`}>
                    <span data-testid={`qty-${item.id}`}>{item.quantity}</span>
                    <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        data-testid={`increase-${item.id}`}
                    >
                        +
                    </button>
                    <button
                        onClick={() => removeFromCart(item.id)}
                        data-testid={`remove-${item.id}`}
                    >
                        Remove
                    </button>
                </div>
            ))}

            <button onClick={() => clearCart()} data-testid="clear-btn">
                Clear All
            </button>

            <button
                onClick={() => applyCouponCode('BOOKWORM10')}
                data-testid="apply-coupon-btn"
            >
                Apply BOOKWORM10
            </button>
        </div>
    )
}

describe('CartContext & State Management', () => {
    const sampleBook = {
        id: 'test-book-1',
        title: 'Modern Architecture',
        price: 500,
        stock: 5,
        coverImage: 'https://example.com/cover.jpg',
    }

    beforeEach(() => {
        localStorage.clear()
    })

    it('initializes with empty cart and zeroes', () => {
        render(
            <CartProvider>
                <TestCartConsumer sampleBook={sampleBook} />
            </CartProvider>
        )

        expect(screen.getByTestId('cart-count').textContent).toBe('0')
        expect(screen.getByTestId('cart-subtotal').textContent).toBe('0')
    })

    it('adds book to cart and updates itemCount and subtotal', async () => {
        const user = userEvent.setup()
        render(
            <CartProvider>
                <TestCartConsumer sampleBook={sampleBook} />
            </CartProvider>
        )

        await user.click(screen.getByTestId('add-sample-btn'))

        expect(screen.getByTestId('cart-count').textContent).toBe('1')
        expect(screen.getByTestId('cart-subtotal').textContent).toBe('500')
        expect(screen.getByTestId('qty-test-book-1').textContent).toBe('1')
    })

    it('caps addition at available book stock', async () => {
        const user = userEvent.setup()
        render(
            <CartProvider>
                <TestCartConsumer sampleBook={sampleBook} />
            </CartProvider>
        )

        // Try to add 999 when stock is 5
        await user.click(screen.getByTestId('add-exceed-btn'))

        expect(screen.getByTestId('cart-count').textContent).toBe('5')
        expect(screen.getByTestId('qty-test-book-1').textContent).toBe('5')
    })

    it('increments quantity and updates totals', async () => {
        const user = userEvent.setup()
        render(
            <CartProvider>
                <TestCartConsumer sampleBook={sampleBook} />
            </CartProvider>
        )

        await user.click(screen.getByTestId('add-sample-btn'))
        await user.click(screen.getByTestId('increase-test-book-1'))

        expect(screen.getByTestId('cart-count').textContent).toBe('2')
        expect(screen.getByTestId('cart-subtotal').textContent).toBe('1000')
    })

    it('removes item from cart', async () => {
        const user = userEvent.setup()
        render(
            <CartProvider>
                <TestCartConsumer sampleBook={sampleBook} />
            </CartProvider>
        )

        await user.click(screen.getByTestId('add-sample-btn'))
        expect(screen.getByTestId('cart-count').textContent).toBe('1')

        await user.click(screen.getByTestId('remove-test-book-1'))
        expect(screen.getByTestId('cart-count').textContent).toBe('0')
        expect(screen.queryByTestId('item-test-book-1')).toBeNull()
    })

    it('applies coupon discount to eligible subtotal', async () => {
        const user = userEvent.setup()
        render(
            <CartProvider>
                <TestCartConsumer sampleBook={sampleBook} />
            </CartProvider>
        )

        await user.click(screen.getByTestId('add-sample-btn')) // Subtotal 500
        await user.click(screen.getByTestId('apply-coupon-btn')) // 10% of 500 = 50

        expect(screen.getByTestId('coupon-code').textContent).toBe('BOOKWORM10')
        expect(screen.getByTestId('discount-amount').textContent).toBe('50')
    })

    it('clears all cart items on clearCart()', async () => {
        const user = userEvent.setup()
        render(
            <CartProvider>
                <TestCartConsumer sampleBook={sampleBook} />
            </CartProvider>
        )

        await user.click(screen.getByTestId('add-sample-btn'))
        await user.click(screen.getByTestId('clear-btn'))

        expect(screen.getByTestId('cart-count').textContent).toBe('0')
        expect(screen.getByTestId('cart-subtotal').textContent).toBe('0')
    })
})
