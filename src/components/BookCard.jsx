import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingBag, Check } from 'lucide-react'
import { formatINR } from '../utils/pricing'
import { useCart } from '../context/CartContext'
import { FALLBACK_BOOK_COVER } from '../data/books'

export default function BookCard({ book }) {
    const { addToCart } = useCart()
    const [imageSrc, setImageSrc] = useState(book.coverImage)
    const [addedAnimation, setAddedAnimation] = useState(false)

    const isOutOfStock = book.stock <= 0
    const isLowStock = book.stock > 0 && book.stock <= 5
    const discountPercent =
        book.originalPrice && book.originalPrice > book.price
            ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
            : 0

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isOutOfStock) return

        addToCart(book, 1)
        setAddedAnimation(true)
        setTimeout(() => setAddedAnimation(false), 1500)
    }

    return (
        <article className="book-card" data-testid={`book-card-${book.id}`}>
            <Link
                to={`/books/${book.id}`}
                className="book-card-cover-wrapper"
                aria-label={`View details for ${book.title}`}
            >
                <img
                    src={imageSrc}
                    alt={`Cover of ${book.title} by ${book.author}`}
                    className="book-card-cover"
                    loading="lazy"
                    onError={() => setImageSrc(FALLBACK_BOOK_COVER)}
                />
                <div className="book-card-badges">
                    {book.bestseller && (
                        <span className="badge badge-amber">Bestseller</span>
                    )}
                    {book.featured && !book.bestseller && (
                        <span className="badge badge-teal">Featured</span>
                    )}
                    {discountPercent > 0 && (
                        <span className="badge badge-primary">{discountPercent}% OFF</span>
                    )}
                </div>
            </Link>

            <div className="book-card-body">
                <span className="book-card-category">{book.category}</span>
                <h3 className="book-card-title">
                    <Link to={`/books/${book.id}`}>{book.title}</Link>
                </h3>
                <p className="book-card-author">by {book.author}</p>

                <div className="book-card-rating">
                    <Star size={15} fill="#D97706" color="#D97706" />
                    <span>{book.rating}</span>
                    <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>
                        ({book.reviewCount.toLocaleString('en-IN')})
                    </span>
                </div>

                <div className="book-card-price-row">
                    <div className="price-container">
                        <span className="price-current">{formatINR(book.price)}</span>
                        {book.originalPrice && book.originalPrice > book.price && (
                            <span className="price-original">
                                {formatINR(book.originalPrice)}
                            </span>
                        )}
                        <span
                            className={`stock-status-pill ${isOutOfStock
                                    ? 'stock-out'
                                    : isLowStock
                                        ? 'stock-low'
                                        : 'stock-in'
                                }`}
                        >
                            {isOutOfStock
                                ? 'Out of Stock'
                                : isLowStock
                                    ? `Only ${book.stock} left!`
                                    : 'In Stock'}
                        </span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`btn btn-sm ${addedAnimation ? 'btn-teal' : 'btn-primary'
                            }`}
                        aria-label={`Add ${book.title} to cart`}
                        data-testid={`add-to-cart-${book.id}`}
                        style={{ borderRadius: 'var(--radius-full)' }}
                    >
                        {addedAnimation ? (
                            <>
                                <Check size={16} /> Added
                            </>
                        ) : isOutOfStock ? (
                            'Sold Out'
                        ) : (
                            <>
                                <ShoppingBag size={16} /> Add
                            </>
                        )}
                    </button>
                </div>
            </div>
        </article>
    )
}
