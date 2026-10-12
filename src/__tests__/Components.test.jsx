import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import BookCard from '../components/BookCard'
import SearchBar from '../components/SearchBar'
import { CartProvider } from '../context/CartContext'

describe('UI Components', () => {
    const sampleBook = {
        id: 'book-sample',
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        price: 899,
        originalPrice: 1299,
        category: 'Technology & Coding',
        rating: 4.9,
        reviewCount: 320,
        stock: 12,
        bestseller: true,
        coverImage: 'https://example.com/cover.jpg',
    }

    describe('BookCard Component', () => {
        it('renders book metadata, price in INR, and tags', () => {
            render(
                <BrowserRouter>
                    <CartProvider>
                        <BookCard book={sampleBook} />
                    </CartProvider>
                </BrowserRouter>
            )

            expect(
                screen.getByText('Designing Data-Intensive Applications')
            ).toBeInTheDocument()
            expect(screen.getByText('Martin Kleppmann')).toBeInTheDocument()
            expect(screen.getByText('Technology & Coding')).toBeInTheDocument()
            expect(screen.getByText(/899/)).toBeInTheDocument()
            expect(screen.getByText('Bestseller')).toBeInTheDocument()
        })

        it('adds book to cart when Add to Cart button is clicked', async () => {
            const user = userEvent.setup()
            render(
                <BrowserRouter>
                    <CartProvider>
                        <BookCard book={sampleBook} />
                    </CartProvider>
                </BrowserRouter>
            )

            const addBtn = screen.getByTestId('add-to-cart-book-sample')
            await user.click(addBtn)

            // Button updates feedback text
            expect(screen.getByText(/Added!/i)).toBeInTheDocument()
        })
    })

    describe('SearchBar Component', () => {
        it('calls onChange with search text', async () => {
            const user = userEvent.setup()
            const handleChange = vi.fn()
            const handleClear = vi.fn()

            render(
                <SearchBar
                    value=""
                    onChange={handleChange}
                    onClear={handleClear}
                    placeholder="Search books..."
                />
            )

            const input = screen.getByTestId('search-books-input')
            await user.type(input, 'javascript')

            expect(handleChange).toHaveBeenCalled()
        })
    })
})
