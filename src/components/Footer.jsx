import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    BookOpen,
    Mail,
    Phone,
    MapPin,
    Heart,
    Send,
    CheckCircle,
} from 'lucide-react'

export default function Footer() {
    const [newsletterEmail, setNewsletterEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)
    const [newsletterError, setNewsletterError] = useState('')

    const handleSubscribe = (e) => {
        e.preventDefault()
        if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
            setNewsletterError('Please provide a valid email address')
            return
        }

        setNewsletterError('')
        setSubscribed(true)
        setNewsletterEmail('')
    }

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand & Mission */}
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                marginBottom: '1rem',
                            }}
                        >
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    background: 'var(--primary)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#FFFFFF',
                                }}
                            >
                                <BookOpen size={18} />
                            </div>
                            <span
                                style={{
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: '1.4rem',
                                    fontWeight: 700,
                                    color: '#FFFFFF',
                                }}
                            >
                                BookHaven
                            </span>
                        </div>
                        <p
                            style={{
                                fontSize: '0.9rem',
                                lineHeight: 1.6,
                                color: '#A8A29E',
                                marginBottom: '1.25rem',
                            }}
                        >
                            Your premier literary destination for timeless classics, modern
                            bestsellers, and technology mastery. Delivering stories and wisdom
                            across India.
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                fontSize: '0.85rem',
                                color: '#78716C',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={16} color="var(--primary)" />
                                <span>MG Road, Bengaluru, Karnataka 560001</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Phone size={16} color="var(--primary)" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Mail size={16} color="var(--primary)" />
                                <span>care@bookhaven.in</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="footer-title">Explore Store</h4>
                        <ul className="footer-links">
                            <li>
                                <Link to="/" className="footer-link">
                                    Home Page
                                </Link>
                            </li>
                            <li>
                                <Link to="/books" className="footer-link">
                                    All Books Catalogue
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="footer-link">
                                    Track Your Orders
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="footer-link">
                                    Shopping Cart
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="footer-link">
                                    User Account
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Popular Categories */}
                    <div>
                        <h4 className="footer-title">Top Genres</h4>
                        <ul className="footer-links">
                            <li>
                                <Link to="/books?category=Fiction" className="footer-link">
                                    Literary Fiction
                                </Link>
                            </li>
                            <li>
                                <Link to="/books?category=Science+Fiction" className="footer-link">
                                    Science Fiction & Fantasy
                                </Link>
                            </li>
                            <li>
                                <Link to="/books?category=Technology+%26+Coding" className="footer-link">
                                    Technology & Coding
                                </Link>
                            </li>
                            <li>
                                <Link to="/books?category=Self-Help" className="footer-link">
                                    Self-Help & Habits
                                </Link>
                            </li>
                            <li>
                                <Link to="/books?category=Philosophy" className="footer-link">
                                    Philosophy & Stoicism
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Box */}
                    <div>
                        <h4 className="footer-title">Join The Readers Club</h4>
                        <p
                            style={{
                                fontSize: '0.88rem',
                                color: '#A8A29E',
                                marginBottom: '1rem',
                            }}
                        >
                            Get weekly reading recommendations, author interviews, and
                            exclusive festive discounts.
                        </p>
                        {subscribed ? (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: 'var(--success)',
                                    backgroundColor: 'rgba(22, 163, 74, 0.15)',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '0.85rem',
                                }}
                            >
                                <CheckCircle size={18} />
                                <span>Thank you for subscribing! Check your inbox soon.</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="email"
                                        value={newsletterEmail}
                                        onChange={(e) => {
                                            setNewsletterEmail(e.target.value)
                                            setNewsletterError('')
                                        }}
                                        placeholder="Enter your email"
                                        aria-label="Email for newsletter subscription"
                                        style={{
                                            flex: 1,
                                            padding: '0.6rem 0.85rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid #44403C',
                                            backgroundColor: '#292524',
                                            color: '#FFFFFF',
                                            fontSize: '0.85rem',
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm"
                                        aria-label="Subscribe to newsletter"
                                    >
                                        <Send size={14} />
                                    </button>
                                </div>
                                {newsletterError && (
                                    <p
                                        style={{
                                            color: '#F87171',
                                            fontSize: '0.75rem',
                                            marginTop: '0.4rem',
                                        }}
                                    >
                                        {newsletterError}
                                    </p>
                                )}
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <p>
                        © {new Date().getFullYear()} BookHaven Bookstore. College Project
                        Demonstration.
                    </p>
                    <p
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8rem',
                        }}
                    >
                        Crafted with <Heart size={14} color="#EF4444" fill="#EF4444" /> for
                        passionate bibliophiles.
                    </p>
                </div>
            </div>
        </footer>
    )
}
