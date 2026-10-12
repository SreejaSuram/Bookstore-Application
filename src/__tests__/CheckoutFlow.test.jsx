import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CartProvider, useCart } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'
import Checkout from '../pages/Checkout'
import OrderSuccess from '../pages/OrderSuccess'
import { STORAGE_KEYS, getStoredItem, setStoredItem } from '../utils/storage'

function CheckoutWithMockItem() {
    const { addToCart } = useCart()

    // Add initial item if cart is empty so checkout doesn't redirect
    React.useEffect(() => {
        addToCart(
            {
                id: 'book-1',
                title: 'The Great Gatsby',
                price: 399,
                stock: 10,
                coverImage: 'https://example.com/cover.jpg',
            },
            1
        )
    }, [])

    return <Checkout />
}

describe('Checkout and Order Flow Integration', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('validates checkout fields and completes simulated order placement', async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter initialEntries={['/checkout']}>
                <AuthProvider>
                    <CartProvider>
                        <Routes>
                            <Route path="/checkout" element={<CheckoutWithMockItem />} />
                            <Route
                                path="/order-success/:orderId"
                                element={<OrderSuccess />}
                            />
                        </Routes>
                    </CartProvider>
                </AuthProvider>
            </MemoryRouter>
        )

        // Ensure form is rendered
        expect(screen.getByTestId('checkout-form')).toBeInTheDocument()

        // Fill valid Indian customer details
        await user.type(screen.getByTestId('checkout-name-input'), 'Kavita Nair')
        await user.type(
            screen.getByTestId('checkout-email-input'),
            'kavita@example.com'
        )
        await user.type(screen.getByTestId('checkout-phone-input'), '9876543210')
        await user.type(
            screen.getByTestId('checkout-address-input'),
            'Flat 402, Lotus Towers, Indiranagar'
        )
        await user.type(screen.getByTestId('checkout-city-input'), 'Bengaluru')
        await user.type(screen.getByTestId('checkout-state-input'), 'Karnataka')
        await user.type(screen.getByTestId('checkout-pin-input'), '560038')

        // Click Place Order
        const placeOrderBtn = screen.getByTestId('place-order-btn')
        await user.click(placeOrderBtn)

        // Wait for simulated order placement and navigation to OrderSuccess
        await waitFor(
            () => {
                expect(
                    screen.getByText(/Order Placed Successfully!/i)
                ).toBeInTheDocument()
            },
            { timeout: 3000 }
        )

        // Verify order ID is shown on screen
        expect(screen.getByTestId('order-id-display')).toBeInTheDocument()

        // Verify order is persisted in localStorage
        const savedOrders = getStoredItem(STORAGE_KEYS.ORDERS, [])
        expect(savedOrders).toHaveLength(1)
        expect(savedOrders[0].customer.fullName).toBe('Kavita Nair')
        expect(savedOrders[0].customer.pinCode).toBe('560038')
    })
})
