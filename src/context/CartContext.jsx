import React, { createContext, useContext, useReducer, useEffect } from 'react'
import {
    STORAGE_KEYS,
    getStoredItem,
    setStoredItem,
} from '../utils/storage'
import {
    calculateCartTotals,
    validateCoupon,
} from '../utils/pricing'

const CartContext = createContext(null)

const CART_ACTIONS = {
    ADD_ITEM: 'ADD_ITEM',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    REMOVE_ITEM: 'REMOVE_ITEM',
    CLEAR_CART: 'CLEAR_CART',
    APPLY_COUPON: 'APPLY_COUPON',
    REMOVE_COUPON: 'REMOVE_COUPON',
    SET_NOTIFICATION: 'SET_NOTIFICATION',
    CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
}

function getInitialState() {
    const persisted = getStoredItem(STORAGE_KEYS.CART, null)
    if (persisted && Array.isArray(persisted.items)) {
        return {
            items: persisted.items,
            activeCoupon: persisted.activeCoupon || null,
            notification: null,
        }
    }
    return {
        items: [],
        activeCoupon: null,
        notification: null,
    }
}

function cartReducer(state, action) {
    switch (action.type) {
        case CART_ACTIONS.ADD_ITEM: {
            const { book, quantity = 1 } = action.payload
            const existingIndex = state.items.findIndex((item) => item.id === book.id)

            if (existingIndex > -1) {
                const existingItem = state.items[existingIndex]
                const availableStock = book.stock || existingItem.stock || 10
                const desiredQuantity = existingItem.quantity + quantity

                if (desiredQuantity > availableStock) {
                    const maxAddable = Math.max(0, availableStock - existingItem.quantity)
                    if (maxAddable === 0) {
                        return {
                            ...state,
                            notification: {
                                type: 'warning',
                                message: `Only ${availableStock} copies in stock for "${book.title}". You already have all in your cart.`,
                            },
                        }
                    }
                    // Cap at available stock
                    const updatedItems = [...state.items]
                    updatedItems[existingIndex] = {
                        ...existingItem,
                        quantity: availableStock,
                    }
                    return {
                        ...state,
                        items: updatedItems,
                        notification: {
                            type: 'info',
                            message: `Adjusted quantity of "${book.title}" to match maximum stock (${availableStock}).`,
                        },
                    }
                }

                const updatedItems = [...state.items]
                updatedItems[existingIndex] = {
                    ...existingItem,
                    quantity: desiredQuantity,
                }
                return {
                    ...state,
                    items: updatedItems,
                    notification: {
                        type: 'success',
                        message: `Added ${quantity} more of "${book.title}" to cart!`,
                    },
                }
            }

            // New item to cart
            const availableStock = book.stock || 10
            const safeQuantity = Math.min(Math.max(1, quantity), availableStock)

            const newItem = {
                id: book.id,
                title: book.title,
                author: book.author,
                price: book.price,
                originalPrice: book.originalPrice,
                coverImage: book.coverImage,
                stock: availableStock,
                category: book.category,
                quantity: safeQuantity,
            }

            return {
                ...state,
                items: [...state.items, newItem],
                notification: {
                    type: 'success',
                    message: `"${book.title}" added to your cart!`,
                },
            }
        }

        case CART_ACTIONS.UPDATE_QUANTITY: {
            const { bookId, quantity } = action.payload
            const targetIndex = state.items.findIndex((item) => item.id === bookId)

            if (targetIndex === -1) return state

            const item = state.items[targetIndex]

            if (quantity <= 0) {
                // Remove item if quantity reduced to 0
                const filtered = state.items.filter((i) => i.id !== bookId)
                return {
                    ...state,
                    items: filtered,
                    notification: {
                        type: 'info',
                        message: `Removed "${item.title}" from your cart.`,
                    },
                }
            }

            const availableStock = item.stock || 10
            if (quantity > availableStock) {
                const updated = [...state.items]
                updated[targetIndex] = { ...item, quantity: availableStock }
                return {
                    ...state,
                    items: updated,
                    notification: {
                        type: 'warning',
                        message: `Cannot exceed available stock of ${availableStock} copies.`,
                    },
                }
            }

            const updated = [...state.items]
            updated[targetIndex] = { ...item, quantity }
            return {
                ...state,
                items: updated,
            }
        }

        case CART_ACTIONS.REMOVE_ITEM: {
            const { bookId } = action.payload
            const item = state.items.find((i) => i.id === bookId)
            return {
                ...state,
                items: state.items.filter((i) => i.id !== bookId),
                notification: {
                    type: 'info',
                    message: item ? `Removed "${item.title}" from cart.` : 'Item removed.',
                },
            }
        }

        case CART_ACTIONS.CLEAR_CART: {
            return {
                ...state,
                items: [],
                activeCoupon: null,
                notification: {
                    type: 'info',
                    message: 'Your cart has been cleared.',
                },
            }
        }

        case CART_ACTIONS.APPLY_COUPON: {
            const { coupon } = action.payload
            return {
                ...state,
                activeCoupon: coupon,
                notification: {
                    type: 'success',
                    message: `Coupon "${coupon.code}" applied successfully!`,
                },
            }
        }

        case CART_ACTIONS.REMOVE_COUPON: {
            return {
                ...state,
                activeCoupon: null,
                notification: {
                    type: 'info',
                    message: 'Coupon removed.',
                },
            }
        }

        case CART_ACTIONS.SET_NOTIFICATION: {
            return {
                ...state,
                notification: action.payload,
            }
        }

        case CART_ACTIONS.CLEAR_NOTIFICATION: {
            return {
                ...state,
                notification: null,
            }
        }

        default:
            return state
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, null, getInitialState)

    // Persist items and coupon to localStorage whenever they change
    useEffect(() => {
        setStoredItem(STORAGE_KEYS.CART, {
            items: state.items,
            activeCoupon: state.activeCoupon,
        })
    }, [state.items, state.activeCoupon])

    // Automatically validate coupon when items change and adjust if min amount no longer met
    useEffect(() => {
        if (state.activeCoupon) {
            const totals = calculateCartTotals(state.items, null)
            if (
                state.activeCoupon.minAmount &&
                totals.subtotal < state.activeCoupon.minAmount
            ) {
                dispatch({ type: CART_ACTIONS.REMOVE_COUPON })
            }
        }
    }, [state.items, state.activeCoupon])

    const totals = calculateCartTotals(state.items, state.activeCoupon)

    const addToCart = (book, quantity = 1) => {
        dispatch({
            type: CART_ACTIONS.ADD_ITEM,
            payload: { book, quantity },
        })
    }

    const updateQuantity = (bookId, quantity) => {
        dispatch({
            type: CART_ACTIONS.UPDATE_QUANTITY,
            payload: { bookId, quantity },
        })
    }

    const removeFromCart = (bookId) => {
        dispatch({
            type: CART_ACTIONS.REMOVE_ITEM,
            payload: { bookId },
        })
    }

    const clearCart = () => {
        dispatch({ type: CART_ACTIONS.CLEAR_CART })
    }

    const applyCouponCode = (code) => {
        const result = validateCoupon(code, totals.subtotal)
        if (!result.valid) {
            dispatch({
                type: CART_ACTIONS.SET_NOTIFICATION,
                payload: { type: 'error', message: result.message },
            })
            return { success: false, message: result.message }
        }
        dispatch({
            type: CART_ACTIONS.APPLY_COUPON,
            payload: { coupon: result.coupon },
        })
        return { success: true, message: result.message }
    }

    const removeCoupon = () => {
        dispatch({ type: CART_ACTIONS.REMOVE_COUPON })
    }

    const clearNotification = () => {
        dispatch({ type: CART_ACTIONS.CLEAR_NOTIFICATION })
    }

    const value = {
        items: state.items,
        activeCoupon: state.activeCoupon,
        notification: state.notification,
        ...totals,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon: applyCouponCode,
        applyCouponCode,
        removeCoupon,
        clearNotification,
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
