import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
    UserPlus,
    ArrowRight,
    AlertCircle,
    BookOpen,
    CheckCircle,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { validateRegisterForm } from '../utils/validation'

export default function Register() {
    const { register, isAuthenticated, user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const rawFrom = location.state?.from?.pathname
    const targetPath =
        rawFrom && rawFrom !== '/login' && rawFrom !== '/register' ? rawFrom : '/'

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState({})
    const [authError, setAuthError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    // If already signed in, display helpful state
    if (isAuthenticated && user) {
        return (
            <div
                className="register-page"
                style={{
                    padding: '4rem 1rem 6rem',
                    minHeight: 'calc(100vh - 250px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    className="card"
                    style={{
                        maxWidth: '440px',
                        width: '100%',
                        padding: '2.5rem',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--success-light)',
                            color: 'var(--success)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.25rem',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                        }}
                    >
                        ✓
                    </div>
                    <h2
                        style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.6rem',
                            marginBottom: '0.5rem',
                        }}
                    >
                        Already Signed In
                    </h2>
                    <p
                        style={{
                            color: 'var(--text-secondary)',
                            marginBottom: '1.75rem',
                            fontSize: '0.95rem',
                        }}
                    >
                        You are currently logged in as <strong>{user.name}</strong> ({user.email}).
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button
                            onClick={() => navigate(targetPath, { replace: true })}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            Continue to Store
                        </button>
                        <button
                            onClick={() => navigate('/books')}
                            className="btn btn-secondary"
                            style={{ width: '100%' }}
                        >
                            Browse Books
                        </button>
                        <button
                            onClick={logout}
                            className="btn"
                            style={{
                                border: '1px solid var(--border)',
                                color: 'var(--text-secondary)',
                                width: '100%',
                            }}
                        >
                            Sign Out Different Account
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }))
        }
        setAuthError('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const validation = validateRegisterForm(formData)
        if (!validation.isValid) {
            setErrors(validation.errors)
            return
        }

        setSubmitting(true)
        const result = register({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
        })
        setSubmitting(false)

        if (result && result.success) {
            navigate(targetPath, { replace: true })
        } else {
            setAuthError(
                result?.error || result?.message || 'Registration failed'
            )
        }
    }

    return (
        <div
            className="register-page"
            style={{
                padding: '3.5rem 1rem 6rem',
                minHeight: 'calc(100vh - 250px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div style={{ maxWidth: '460px', width: '100%' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-lg)',
                            backgroundColor: 'var(--primary)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem',
                        }}
                    >
                        <BookOpen size={24} />
                    </div>
                    <h1 className="heading-section" style={{ marginBottom: '0.4rem' }}>
                        Create an Account
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Join BookHaven to track orders, save books, and receive member perks.
                    </p>
                </div>

                {/* Card */}
                <div className="card" style={{ padding: '2rem' }}>
                    {authError && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: 'var(--danger-light)',
                                color: 'var(--danger)',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.88rem',
                                marginBottom: '1.25rem',
                            }}
                            data-testid="register-auth-error"
                        >
                            <AlertCircle size={18} />
                            <span>{authError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate data-testid="register-form">
                        <div className="form-group">
                            <label htmlFor="reg-name" className="form-label">
                                Full Name *
                            </label>
                            <input
                                id="reg-name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Priya Sharma"
                                className={`form-input ${errors.name ? 'has-error' : ''}`}
                                data-testid="register-name-input"
                                required
                            />
                            {errors.name && (
                                <span className="form-error">
                                    <AlertCircle size={14} /> {errors.name}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-email" className="form-label">
                                Email Address *
                            </label>
                            <input
                                id="reg-email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="priya@example.com"
                                className={`form-input ${errors.email ? 'has-error' : ''}`}
                                data-testid="register-email-input"
                                required
                            />
                            {errors.email && (
                                <span className="form-error">
                                    <AlertCircle size={14} /> {errors.email}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-phone" className="form-label">
                                Mobile Number (India) *
                            </label>
                            <input
                                id="reg-phone"
                                name="phone"
                                type="tel"
                                maxLength={10}
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="9876543210"
                                className={`form-input ${errors.phone ? 'has-error' : ''}`}
                                data-testid="register-phone-input"
                                required
                            />
                            {errors.phone && (
                                <span className="form-error">
                                    <AlertCircle size={14} /> {errors.phone}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-password" className="form-label">
                                Password (min. 6 characters) *
                            </label>
                            <input
                                id="reg-password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`form-input ${errors.password ? 'has-error' : ''}`}
                                data-testid="register-password-input"
                                required
                            />
                            {errors.password && (
                                <span className="form-error">
                                    <AlertCircle size={14} /> {errors.password}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-confirm" className="form-label">
                                Confirm Password *
                            </label>
                            <input
                                id="reg-confirm"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`form-input ${errors.confirmPassword ? 'has-error' : ''
                                    }`}
                                data-testid="register-confirm-password-input"
                                required
                            />
                            {errors.confirmPassword && (
                                <span className="form-error">
                                    <AlertCircle size={14} /> {errors.confirmPassword}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: '0.75rem' }}
                            data-testid="register-submit-btn"
                        >
                            <UserPlus size={18} /> Create Account
                        </button>
                    </form>
                </div>

                {/* Login Prompt */}
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            style={{
                                fontWeight: 600,
                                color: 'var(--primary)',
                                textDecoration: 'underline',
                            }}
                            data-testid="go-to-login-link"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
