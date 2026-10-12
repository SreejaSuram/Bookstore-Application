import React from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowRight,
    Sparkles,
    Truck,
    ShieldCheck,
    BookOpen,
    Award,
    TrendingUp,
    Percent,
} from 'lucide-react'
import BookCard from '../components/BookCard'
import { BOOKS, CATEGORIES } from '../data/books'
import { formatINR, FREE_SHIPPING_THRESHOLD } from '../utils/pricing'

export default function Home() {
    const featuredBooks = BOOKS.filter((b) => b.featured).slice(0, 4)
    const bestsellerBooks = BOOKS.filter((b) => b.bestseller).slice(0, 4)

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section
                style={{
                    background:
                        'linear-gradient(180deg, #F5EFEB 0%, var(--bg-page) 100%)',
                    padding: '4rem 0 3.5rem',
                    borderBottom: '1px solid var(--border-subtle)',
                }}
            >
                <div className="container">
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '3rem',
                            alignItems: 'center',
                        }}
                    >
                        {/* Hero Text */}
                        <div>
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.35rem 0.85rem',
                                    borderRadius: 'var(--radius-full)',
                                    backgroundColor: 'var(--primary-light)',
                                    color: 'var(--primary-hover)',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    marginBottom: '1.25rem',
                                }}
                            >
                                <Sparkles size={16} /> Curated Independent Bookstore
                            </div>

                            <h1 className="heading-hero" style={{ marginBottom: '1.25rem' }}>
                                Stories That Inspire. <br />
                                <span style={{ color: 'var(--primary)' }}>
                                    Wisdom That Endures.
                                </span>
                            </h1>

                            <p
                                style={{
                                    fontSize: '1.1rem',
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.6,
                                    marginBottom: '2rem',
                                    maxWidth: '520px',
                                }}
                            >
                                Immerse yourself in thousands of award-winning novels,
                                engineering masterpieces, and philosophical guides. Fast
                                delivery across India.
                            </p>

                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '1rem',
                                    marginBottom: '2.5rem',
                                }}
                            >
                                <Link
                                    to="/books"
                                    className="btn btn-primary btn-lg"
                                    data-testid="hero-explore-btn"
                                >
                                    Explore Books <ArrowRight size={18} />
                                </Link>
                                <Link
                                    to="/books?sort=bestseller"
                                    className="btn btn-secondary btn-lg"
                                >
                                    View Bestsellers
                                </Link>
                            </div>

                            {/* Value Badges */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '1.5rem',
                                    paddingTop: '1.5rem',
                                    borderTop: '1px solid var(--border)',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Truck size={18} color="var(--primary)" />
                                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                                        Free Shipping above {formatINR(FREE_SHIPPING_THRESHOLD)}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ShieldCheck size={18} color="var(--accent-teal)" />
                                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                                        100% Genuine Editions
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Award size={18} color="var(--accent-amber)" />
                                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                                        Top Rated Reads
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image Mosaic */}
                        <div
                            style={{
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <div
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    maxWidth: '440px',
                                    aspectRatio: '4/5',
                                    borderRadius: 'var(--radius-xl)',
                                    overflow: 'hidden',
                                    boxShadow: 'var(--shadow-xl)',
                                    border: '8px solid #FFFFFF',
                                }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=900&auto=format&fit=crop"
                                    alt="Cozy bookstore reader environment"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: '20px',
                                        left: '20px',
                                        right: '20px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.94)',
                                        backdropFilter: 'blur(8px)',
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-md)',
                                        boxShadow: 'var(--shadow-md)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                                            FEATURED PICK
                                        </p>
                                        <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                            Meditations & Stoic Mindset
                                        </p>
                                    </div>
                                    <Link
                                        to="/books/book-9"
                                        className="btn btn-primary btn-sm"
                                        style={{ borderRadius: 'var(--radius-full)' }}
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Categories Grid */}
            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
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
                                    letterSpacing: '0.05em',
                                    marginBottom: '0.35rem',
                                }}
                            >
                                Curated Collections
                            </p>
                            <h2 className="heading-section">Popular Categories</h2>
                        </div>
                        <Link
                            to="/books"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: 600,
                                color: 'var(--primary)',
                                fontSize: '0.95rem',
                            }}
                        >
                            Browse All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '1rem',
                        }}
                    >
                        {CATEGORIES.filter((c) => c !== 'All').map((category) => (
                            <Link
                                key={category}
                                to={`/books?category=${encodeURIComponent(category)}`}
                                className="card"
                                style={{
                                    padding: '1.25rem 1rem',
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.6rem',
                                    textDecoration: 'none',
                                }}
                                data-testid={`category-card-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            >
                                <div
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: 'var(--radius-full)',
                                        backgroundColor: 'var(--primary-subtle)',
                                        color: 'var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <BookOpen size={20} />
                                </div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                                    {category}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Books Section */}
            <section
                style={{
                    padding: '4rem 0',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderTop: '1px solid var(--border-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                }}
            >
                <div className="container">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            marginBottom: '2.5rem',
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--primary)',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: '0.35rem',
                                }}
                            >
                                Handpicked Selections
                            </p>
                            <h2 className="heading-section">Featured Books</h2>
                        </div>
                        <Link
                            to="/books"
                            className="btn btn-outline btn-sm"
                            style={{ borderRadius: 'var(--radius-full)' }}
                        >
                            View Catalogue <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: '1.5rem',
                        }}
                        data-testid="featured-books-grid"
                    >
                        {featuredBooks.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Promotional Banner */}
            <section style={{ padding: '3.5rem 0' }}>
                <div className="container">
                    <div
                        style={{
                            background:
                                'linear-gradient(135deg, #1C1917 0%, #292524 60%, #44403C 100%)',
                            borderRadius: 'var(--radius-xl)',
                            padding: '3rem 2.5rem',
                            color: '#FFFFFF',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '2rem',
                            alignItems: 'center',
                            boxShadow: 'var(--shadow-xl)',
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.3rem 0.75rem',
                                    borderRadius: 'var(--radius-full)',
                                    backgroundColor: 'rgba(217, 119, 6, 0.2)',
                                    color: '#FBBF24',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    marginBottom: '1rem',
                                }}
                            >
                                <Percent size={14} /> LIMITED TIME OFFER
                            </div>
                            <h2
                                style={{
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: '2rem',
                                    fontWeight: 700,
                                    marginBottom: '0.75rem',
                                }}
                            >
                                BookWorm Spring Reading Festival
                            </h2>
                            <p
                                style={{
                                    color: '#D6D3D1',
                                    fontSize: '1rem',
                                    lineHeight: 1.6,
                                    marginBottom: '1.5rem',
                                }}
                            >
                                Enjoy an additional <strong>10% OFF</strong> across our entire
                                collection. Apply coupon code at checkout!
                            </p>
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px dashed #78716C',
                                }}
                            >
                                <span style={{ fontSize: '0.85rem', color: '#A8A29E' }}>
                                    Use Coupon:
                                </span>
                                <span
                                    style={{
                                        fontFamily: 'monospace',
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        color: '#FBBF24',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    BOOKWORM10
                                </span>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <Link
                                to="/books"
                                className="btn btn-primary btn-lg"
                                style={{
                                    backgroundColor: '#D97706',
                                    color: '#FFFFFF',
                                    borderRadius: 'var(--radius-full)',
                                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)',
                                }}
                            >
                                Shop Sale Collection <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Best Sellers Section */}
            <section style={{ padding: '2rem 0 5rem' }}>
                <div className="container">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            marginBottom: '2.5rem',
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--accent-amber)',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: '0.35rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}
                            >
                                <TrendingUp size={16} /> Reader Favorites
                            </p>
                            <h2 className="heading-section">Bestselling Books</h2>
                        </div>
                        <Link
                            to="/books"
                            className="btn btn-outline btn-sm"
                            style={{ borderRadius: 'var(--radius-full)' }}
                        >
                            Browse All <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: '1.5rem',
                        }}
                        data-testid="bestseller-books-grid"
                    >
                        {bestsellerBooks.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
