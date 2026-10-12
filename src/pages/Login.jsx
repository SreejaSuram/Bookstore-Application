import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
    Lock,
    Mail,
    ArrowRight,
    AlertCircle,
    Sparkles,
    BookOpen,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { validateLoginForm } from '../utils/validation'

export default function Login() {
    const { login, isAuthenticated, user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const rawFrom = location.state?.from?.pathname
    const targetPath =
        rawFrom && rawFrom !== '/login' && rawFrom !== '/register' ? rawFrom : '/'

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState({})
    const [authError, setAuthError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    // If already signed in, show status or allow instant navigation
    if (isAuthenticated && user) {
        return (
            <div
                className="login-page"
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

    const handleDemoFill = () => {
        setFormData({
            email: 'demo@bookhaven.in',
            password: 'Demo@123',
        })
        setErrors({})
        setAuthError('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const validation = validateLoginForm(formData)
        if (!validation.isValid) {
            setErrors(validation.errors)
            return
        }

        setSubmitting(true)
        const result = login(formData.email, formData.password)
        setSubmitting(false)

        if (result && result.success) {
            navigate(targetPath, { replace: true })
        } else {
            setAuthError(
                result?.error || result?.message || 'Invalid email or password'
            )
        }
    }

    return (
        <div
            className="login-page"
            style={{
                padding: '4rem 1rem 6rem',
                minHeight: 'calc(100vh - 250px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div style={{ maxWidth: '440px', width: '100%' }}>
                {/* Brand Header */}
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
                        Welcome Back
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Sign in to access your BookHaven account and saved orders.
                    </p>
                </div>

                {/* Form Card */}
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
                            data-testid="login-auth-error"
                        >
                            <AlertCircle size={18} />
                            <span>{authError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate data-testid="login-form">
                        <div className="form-group">
                            <label htmlFor="login-email" className="form-label">
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="login-email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    className={`form-input ${errors.email ? 'has-error' : ''}`}
                                    data-testid="login-email-input"
                                    required
                                />
                            </div>
                            {errors.email && (
                                <span className="form-error">
                                    <AlertCircle size={14} /> {errors.email}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="login-password" className="form-label">
                                Password
                            </label>
                            <input
                                id="login-password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`form-input ${errors.password ? 'has-error' : ''}`}
                                data-testid="login-password-input"
                                required
                            />
                            {errors.password && (
                                <span className="form-error">
                                    <AlertCircle size={14} /> {errors.password}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            data-testid="login-submit-btn"
                        >
                            <Lock size={18} /> Sign In
                        </button>
                    </form>

                    {/* Quick Demo Fill Button */}
                    <div
                        style={{
                            marginTop: '1.5rem',
                            paddingTop: '1.25rem',
                            borderTop: '1px solid var(--border-subtle)',
                            textAlign: 'center',
                        }}
                    >
                        <p
                            style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                marginBottom: '0.5rem',
                            }}
                        >
                            Evaluating the project? Use pre-configured demo credentials:
                        </p>
                        <button
                            type="button"
                            onClick={handleDemoFill}
                            className="btn btn-secondary btn-sm"
                            style={{
                                width: '100%',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                            }}
                            data-testid="demo-login-fill-btn"
                        >
                            <Sparkles size={15} color="var(--primary)" /> Autofill Demo
                            Account
                        </button>
                    </div>
                </div>

                {/* Register Prompt */}
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Don't have an account yet?{' '}
                        <Link
                            to="/register"
                            style={{
                                fontWeight: 600,
                                color: 'var(--primary)',
                                textDecoration: 'underline',
                            }}
                            data-testid="go-to-register-link"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
