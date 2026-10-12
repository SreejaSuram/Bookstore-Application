import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div
            className="not-found-page"
            style={{
                padding: '5rem 1rem',
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
            }}
        >
            <div style={{ maxWidth: '480px' }}>
                <div
                    style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '6rem',
                        fontWeight: 800,
                        lineHeight: 1,
                        color: 'var(--primary)',
                        marginBottom: '1rem',
                    }}
                >
                    404
                </div>

                <h1 className="heading-section" style={{ marginBottom: '1rem' }}>
                    Page Not Found
                </h1>

                <p
                    style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1rem',
                        lineHeight: 1.6,
                        marginBottom: '2rem',
                    }}
                >
                    The page you are looking for may have been moved, renamed, or is
                    temporarily unavailable. Let's guide you back to our library.
                </p>

                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <Link to="/" className="btn btn-primary" data-testid="404-home-btn">
                        <Home size={18} /> Back to Home
                    </Link>
                    <Link
                        to="/books"
                        className="btn btn-secondary"
                        data-testid="404-catalogue-btn"
                    >
                        <BookOpen size={18} /> Browse Catalogue
                    </Link>
                </div>
            </div>
        </div>
    )
}
