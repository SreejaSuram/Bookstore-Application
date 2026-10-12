import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
    BookOpen,
    ShoppingBag,
    User,
    LogOut,
    Menu,
    X,
    Search,
    Package,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { itemCount } = useCart()
    const { user, isAuthenticated, logout } = useAuth()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userDropdownOpen, setUserDropdownOpen] = useState(false)
    const [navSearch, setNavSearch] = useState('')
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        setUserDropdownOpen(false)
        setMobileMenuOpen(false)
        navigate('/login')
    }

    const handleNavSearch = (e) => {
        e.preventDefault()
        if (navSearch.trim()) {
            navigate(`/books?search=${encodeURIComponent(navSearch.trim())}`)
            setNavSearch('')
            setMobileMenuOpen(false)
        }
    }

    return (
        <header className="navbar">
            <div className="container navbar-inner">
                {/* Brand Logo */}
                <Link
                    to="/"
                    className="brand-logo"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="brand-logo"
                >
                    <div className="brand-logo-icon">
                        <BookOpen size={20} />
                    </div>
                    <span>BookHaven</span>
                </Link>

                {/* Desktop Quick Search */}
                <form
                    onSubmit={handleNavSearch}
                    style={{
                        position: 'relative',
                        display: 'none',
                        maxWidth: '300px',
                        width: '100%',
                    }}
                    className="navbar-search-desktop"
                >
                    <Search
                        size={16}
                        color="var(--text-muted)"
                        style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                        }}
                    />
                    <input
                        type="search"
                        value={navSearch}
                        onChange={(e) => setNavSearch(e.target.value)}
                        placeholder="Quick search books..."
                        aria-label="Quick search books"
                        className="form-input"
                        style={{
                            padding: '0.45rem 1rem 0.45rem 36px',
                            fontSize: '0.88rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--bg-surface-subtle)',
                            border: '1px solid var(--border)',
                        }}
                    />
                </form>

                {/* Desktop Navigation Links */}
                <nav aria-label="Main Navigation">
                    <ul className="nav-links">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active' : ''}`
                                }
                                end
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/books"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active' : ''}`
                                }
                            >
                                Books
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/orders"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active' : ''}`
                                }
                            >
                                Orders
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                {/* Right Actions: Cart & Auth */}
                <div className="nav-actions">
                    {/* Shopping Cart Button */}
                    <Link
                        to="/cart"
                        className="cart-button"
                        aria-label={`Shopping cart with ${itemCount} items`}
                        data-testid="navbar-cart-btn"
                    >
                        <ShoppingBag size={20} />
                        {itemCount > 0 && (
                            <span className="cart-badge" data-testid="cart-badge-count">
                                {itemCount}
                            </span>
                        )}
                    </Link>

                    {/* User Auth Section */}
                    {isAuthenticated ? (
                        <div style={{ position: 'relative' }}>
                            <button
                                type="button"
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="btn btn-secondary btn-sm"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                    borderRadius: 'var(--radius-full)',
                                    padding: '0.4rem 0.85rem',
                                }}
                                aria-expanded={userDropdownOpen}
                                aria-label="User profile options"
                                data-testid="user-menu-btn"
                            >
                                <div
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--primary)',
                                        color: 'var(--text-inverse)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                    }}
                                >
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                    {user?.name?.split(' ')[0] || 'Account'}
                                </span>
                            </button>

                            {userDropdownOpen && (
                                <div
                                    className="card"
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: 'calc(100% + 8px)',
                                        width: '210px',
                                        padding: '0.5rem',
                                        boxShadow: 'var(--shadow-xl)',
                                        zIndex: 200,
                                    }}
                                    onMouseLeave={() => setUserDropdownOpen(false)}
                                >
                                    <div
                                        style={{
                                            padding: '0.5rem 0.75rem',
                                            borderBottom: '1px solid var(--border-subtle)',
                                            marginBottom: '0.35rem',
                                        }}
                                    >
                                        <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                                            {user?.name}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-muted)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {user?.email}
                                        </p>
                                    </div>

                                    <Link
                                        to="/orders"
                                        onClick={() => setUserDropdownOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 0.75rem',
                                            fontSize: '0.88rem',
                                            borderRadius: 'var(--radius-sm)',
                                            color: 'var(--text-main)',
                                        }}
                                    >
                                        <Package size={16} /> My Orders
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 0.75rem',
                                            fontSize: '0.88rem',
                                            borderRadius: 'var(--radius-sm)',
                                            color: 'var(--danger)',
                                            textAlign: 'left',
                                        }}
                                        data-testid="logout-btn"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Link
                                to="/login"
                                className="btn btn-secondary btn-sm"
                                data-testid="login-nav-btn"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn-primary btn-sm"
                                style={{ display: 'none' }}
                                data-testid="register-nav-btn"
                            >
                                Register
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="btn-icon"
                        style={{ display: 'flex' }}
                        aria-label="Toggle mobile menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {mobileMenuOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'var(--navbar-height)',
                        left: 0,
                        right: 0,
                        backgroundColor: 'var(--bg-surface)',
                        borderBottom: '1px solid var(--border)',
                        padding: '1.25rem',
                        boxShadow: 'var(--shadow-lg)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}
                >
                    <form onSubmit={handleNavSearch} style={{ position: 'relative' }}>
                        <Search
                            size={16}
                            color="var(--text-muted)"
                            style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                            }}
                        />
                        <input
                            type="search"
                            value={navSearch}
                            onChange={(e) => setNavSearch(e.target.value)}
                            placeholder="Search catalog..."
                            className="form-input"
                            style={{
                                paddingLeft: '36px',
                                borderRadius: 'var(--radius-full)',
                            }}
                        />
                    </form>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="nav-link"
                            style={{ padding: '0.5rem 0', fontSize: '1.05rem' }}
                        >
                            Home
                        </Link>
                        <Link
                            to="/books"
                            onClick={() => setMobileMenuOpen(false)}
                            className="nav-link"
                            style={{ padding: '0.5rem 0', fontSize: '1.05rem' }}
                        >
                            Browse Books
                        </Link>
                        <Link
                            to="/orders"
                            onClick={() => setMobileMenuOpen(false)}
                            className="nav-link"
                            style={{ padding: '0.5rem 0', fontSize: '1.05rem' }}
                        >
                            My Orders
                        </Link>
                        <Link
                            to="/cart"
                            onClick={() => setMobileMenuOpen(false)}
                            className="nav-link"
                            style={{ padding: '0.5rem 0', fontSize: '1.05rem' }}
                        >
                            Cart ({itemCount})
                        </Link>
                    </nav>

                    <div
                        style={{
                            paddingTop: '0.75rem',
                            borderTop: '1px solid var(--border)',
                            display: 'flex',
                            gap: '0.75rem',
                        }}
                    >
                        {isAuthenticated ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="btn btn-danger-outline btn-sm"
                                style={{ width: '100%' }}
                            >
                                Logout ({user?.name})
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="btn btn-secondary btn-sm"
                                    style={{ flex: 1 }}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="btn btn-primary btn-sm"
                                    style={{ flex: 1 }}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
