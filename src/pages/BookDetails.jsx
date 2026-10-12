import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    ArrowLeft,
    Star,
    ShoppingBag,
    Check,
    Truck,
    ShieldCheck,
    RefreshCw,
    Plus,
    Minus,
    BookOpen,
} from 'lucide-react'
import { BOOKS, FALLBACK_BOOK_COVER } from '../data/books'
import { formatINR, FREE_SHIPPING_THRESHOLD } from '../utils/pricing'
import { useCart } from '../context/CartContext'
import BookCard from '../components/BookCard'

export default function BookDetails() {
    const { id } = useParams()
    const { addToCart } = useCart()

    const book = BOOKS.find((b) => b.id === id)
    const [selectedQuantity, setSelectedQuantity] = useState(1)
    const [imageSrc, setImageSrc] = useState(book?.coverImage || '')
    const [justAdded, setJustAdded] = useState(false)

    // Handle invalid book ID gracefully
    if (!book) {
        return (
            <div className="container" style={{ padding: '4rem 0' }}>
                <div className="empty-state" data-testid="book-not-found-state">
                    <BookOpen className="empty-state-icon" />
                    <h2 className="empty-state-title">Book Not Found</h2>
                    <p className="empty-state-desc">
                        We couldn't locate any book with identifier "{id}". It may have been
                        removed or the link might be misspelled.
                    </p>
                    <Link
                        to="/books"
                        className="btn btn-primary"
                        data-testid="back-to-books-btn"
                    >
                        <ArrowLeft size={16} /> Return to Catalogue
                    </Link>
                </div>
            </div>
        )
    }

    const isOutOfStock = book.stock <= 0
    const isLowStock = book.stock > 0 && book.stock <= 5
    const discountPercent =
        book.originalPrice && book.originalPrice > book.price
            ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
            : 0

    const relatedBooks = BOOKS.filter(
        (b) => b.category === book.category && b.id !== book.id
    ).slice(0, 4)

    const handleDecreaseQuantity = () => {
        setSelectedQuantity((prev) => Math.max(1, prev - 1))
    }

    const handleIncreaseQuantity = () => {
        setSelectedQuantity((prev) => Math.min(book.stock, prev + 1))
    }

    const handleAddToCart = () => {
        if (isOutOfStock) return
        addToCart(book, selectedQuantity)
        setJustAdded(true)
        setTimeout(() => setJustAdded(false), 2000)
    }

    return (
        <div className="book-details-page" style={{ padding: '2.5rem 0 5rem' }}>
            <div className="container">
                {/* Navigation Breadcrumb / Back Link */}
                <div style={{ marginBottom: '2rem' }}>
                    <Link
                        to="/books"
                        className="btn btn-secondary btn-sm"
                        style={{ borderRadius: 'var(--radius-full)' }}
                        data-testid="back-to-catalog-link"
                    >
                        <ArrowLeft size={16} /> Back to Books
                    </Link>
                </div>

                {/* Main Details Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '3.5rem',
                        alignItems: 'start',
                        marginBottom: '4.5rem',
                    }}
                >
                    {/* Book Cover Presentation */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                maxWidth: '420px',
                                aspectRatio: '2/3',
                                borderRadius: 'var(--radius-xl)',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-xl)',
                                backgroundColor: 'var(--bg-surface-subtle)',
                                border: '1px solid var(--border)',
                                position: 'relative',
                            }}
                        >
                            <img
                                src={imageSrc || FALLBACK_BOOK_COVER}
                                alt={`Book cover of ${book.title}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={() => setImageSrc(FALLBACK_BOOK_COVER)}
                                data-testid="book-details-cover"
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    left: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px',
                                }}
                            >
                                {discountPercent > 0 && (
                                    <span className="badge badge-primary">
                                        {discountPercent}% OFF
                                    </span>
                                )}
                                {book.bestseller && (
                                    <span className="badge badge-amber">Bestseller</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Book Information & Purchase Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <span
                                style={{
                                    fontSize: '0.85rem',
                                    textTransform: 'uppercase',
                                    fontWeight: 700,
                                    letterSpacing: '0.05em',
                                    color: 'var(--accent-teal)',
                                }}
                            >
                                {book.category}
                            </span>
                            <h1
                                className="heading-section"
                                style={{ marginTop: '0.25rem', marginBottom: '0.4rem' }}
                                data-testid="book-details-title"
                            >
                                {book.title}
                            </h1>
                            <p
                                style={{
                                    fontSize: '1.1rem',
                                    color: 'var(--text-secondary)',
                                    fontWeight: 500,
                                }}
                            >
                                Written by{' '}
                                <strong style={{ color: 'var(--text-main)' }}>
                                    {book.author}
                                </strong>
                            </p>
                        </div>

                        {/* Rating Row */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.5rem 0',
                                borderBottom: '1px solid var(--border-subtle)',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    backgroundColor: 'var(--accent-amber-subtle)',
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: 'var(--radius-sm)',
                                    color: '#B45309',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                }}
                            >
                                <Star size={16} fill="#D97706" color="#D97706" />
                                <span>{book.rating}</span>
                            </div>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Based on {book.reviewCount.toLocaleString('en-IN')} verified
                                reader reviews
                            </span>
                        </div>

                        {/* Price Display */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: '1rem',
                                margin: '0.5rem 0',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '2.25rem',
                                    fontWeight: 800,
                                    color: 'var(--primary)',
                                }}
                                data-testid="book-details-price"
                            >
                                {formatINR(book.price)}
                            </span>
                            {book.originalPrice && book.originalPrice > book.price && (
                                <span
                                    style={{
                                        fontSize: '1.25rem',
                                        color: 'var(--text-light)',
                                        textDecoration: 'line-through',
                                    }}
                                >
                                    {formatINR(book.originalPrice)}
                                </span>
                            )}
                            <span
                                style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--text-muted)',
                                }}
                            >
                                (Inclusive of all taxes)
                            </span>
                        </div>

                        {/* Synopsis Description */}
                        <div>
                            <h3
                                style={{
                                    fontSize: '1.05rem',
                                    fontWeight: 700,
                                    marginBottom: '0.5rem',
                                }}
                            >
                                Synopsis
                            </h3>
                            <p
                                style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.98rem',
                                    lineHeight: 1.7,
                                }}
                            >
                                {book.description}
                            </p>
                        </div>

                        {/* Book Metadata Grid */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                                gap: '0.75rem',
                                padding: '1rem',
                                backgroundColor: 'var(--bg-surface-subtle)',
                                borderRadius: 'var(--radius-md)',
                            }}
                        >
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    ISBN
                                </p>
                                <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                                    {book.isbn}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Pages
                                </p>
                                <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                                    {book.pages} pages
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Language
                                </p>
                                <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                                    {book.language}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Published
                                </p>
                                <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                                    {book.publishedYear}
                                </p>
                            </div>
                        </div>

                        {/* Stock Availability & Quantity Control */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                padding: '1.25rem',
                                border: '1.5px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                backgroundColor: 'var(--bg-surface)',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <span
                                    style={{
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        color: isOutOfStock
                                            ? 'var(--danger)'
                                            : isLowStock
                                                ? 'var(--warning)'
                                                : 'var(--success)',
                                    }}
                                    data-testid="book-stock-status"
                                >
                                    {isOutOfStock
                                        ? 'Currently Out of Stock'
                                        : isLowStock
                                            ? `Limited Stock! Only ${book.stock} copies remaining`
                                            : `In Stock (${book.stock} available)`}
                                </span>

                                {!isOutOfStock && (
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        Max: {book.stock}
                                    </span>
                                )}
                            </div>

                            {!isOutOfStock && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.25rem',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <label
                                        htmlFor="details-quantity"
                                        style={{ fontWeight: 600, fontSize: '0.9rem' }}
                                    >
                                        Select Quantity:
                                    </label>

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
                                            onClick={handleDecreaseQuantity}
                                            disabled={selectedQuantity <= 1}
                                            style={{
                                                padding: '0.5rem 0.85rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'var(--bg-surface-subtle)',
                                                cursor:
                                                    selectedQuantity <= 1 ? 'not-allowed' : 'pointer',
                                            }}
                                            aria-label="Decrease quantity"
                                            data-testid="decrease-details-quantity"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span
                                            id="details-quantity"
                                            style={{
                                                width: '48px',
                                                textAlign: 'center',
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                            }}
                                            data-testid="details-quantity-value"
                                        >
                                            {selectedQuantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleIncreaseQuantity}
                                            disabled={selectedQuantity >= book.stock}
                                            style={{
                                                padding: '0.5rem 0.85rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor:
                                                    selectedQuantity >= book.stock
                                                        ? 'var(--border-subtle)'
                                                        : 'var(--bg-surface-subtle)',
                                                cursor:
                                                    selectedQuantity >= book.stock
                                                        ? 'not-allowed'
                                                        : 'pointer',
                                            }}
                                            aria-label="Increase quantity"
                                            data-testid="increase-details-quantity"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock}
                                    className={`btn btn-lg ${justAdded ? 'btn-teal' : 'btn-primary'
                                        }`}
                                    style={{ flex: 1, borderRadius: 'var(--radius-md)' }}
                                    data-testid="details-add-to-cart-btn"
                                >
                                    {justAdded ? (
                                        <>
                                            <Check size={20} /> Added to Cart!
                                        </>
                                    ) : isOutOfStock ? (
                                        'Out of Stock'
                                    ) : (
                                        <>
                                            <ShoppingBag size={20} /> Add to Cart •{' '}
                                            {formatINR(book.price * selectedQuantity)}
                                        </>
                                    )}
                                </button>

                                <Link
                                    to="/cart"
                                    className="btn btn-secondary btn-lg"
                                    data-testid="view-cart-link"
                                >
                                    View Cart
                                </Link>
                            </div>
                        </div>

                        {/* Delivery & Assurance Perks */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem',
                                marginTop: '0.5rem',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-secondary)',
                                }}
                            >
                                <Truck size={20} color="var(--primary)" />
                                <span>
                                    Free Delivery on orders above {formatINR(FREE_SHIPPING_THRESHOLD)}
                                </span>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-secondary)',
                                }}
                            >
                                <RefreshCw size={20} color="var(--accent-teal)" />
                                <span>7-Day Replacement Guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Books Section */}
                {relatedBooks.length > 0 && (
                    <section
                        style={{
                            paddingTop: '3.5rem',
                            borderTop: '1px solid var(--border)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                marginBottom: '2rem',
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--accent-teal)',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    More from {book.category}
                                </p>
                                <h2 className="heading-section">Readers Also Enjoyed</h2>
                            </div>
                            <Link
                                to={`/books?category=${encodeURIComponent(book.category)}`}
                                className="btn btn-outline btn-sm"
                            >
                                Explore {book.category}
                            </Link>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                gap: '1.5rem',
                            }}
                            data-testid="related-books-grid"
                        >
                            {relatedBooks.map((relBook) => (
                                <BookCard key={relBook.id} book={relBook} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
