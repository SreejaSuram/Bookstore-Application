import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../context/AuthContext'

function TestAuthConsumer() {
    const { user, isAuthenticated, login, logout, register } = useAuth()

    return (
        <div>
            <div data-testid="auth-status">
                {isAuthenticated ? 'LOGGED_IN' : 'LOGGED_OUT'}
            </div>
            <div data-testid="user-email">{user?.email || 'NONE'}</div>

            <button
                onClick={() => login('demo@bookhaven.in', 'Demo@123')}
                data-testid="login-demo-btn"
            >
                Login Demo
            </button>

            <button
                onClick={() => login('demo@bookhaven.in', 'WrongPassword')}
                data-testid="login-fail-btn"
            >
                Login Fail
            </button>

            <button
                onClick={() =>
                    register({
                        name: 'New Reader',
                        email: 'newreader@bookhaven.in',
                        phone: '9876543210',
                        password: 'SecurePassword123',
                    })
                }
                data-testid="register-new-btn"
            >
                Register New
            </button>

            <button onClick={() => logout()} data-testid="logout-btn">
                Logout
            </button>
        </div>
    )
}

describe('AuthContext Simulated Authentication', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('initializes as logged out when no session token exists', () => {
        render(
            <AuthProvider>
                <TestAuthConsumer />
            </AuthProvider>
        )

        expect(screen.getByTestId('auth-status').textContent).toBe('LOGGED_OUT')
        expect(screen.getByTestId('user-email').textContent).toBe('NONE')
    })

    it('authenticates demo user with valid credentials', async () => {
        const user = userEvent.setup()
        render(
            <AuthProvider>
                <TestAuthConsumer />
            </AuthProvider>
        )

        await user.click(screen.getByTestId('login-demo-btn'))

        expect(screen.getByTestId('auth-status').textContent).toBe('LOGGED_IN')
        expect(screen.getByTestId('user-email').textContent).toBe(
            'demo@bookhaven.in'
        )
    })

    it('rejects authentication with invalid password', async () => {
        const user = userEvent.setup()
        render(
            <AuthProvider>
                <TestAuthConsumer />
            </AuthProvider>
        )

        await user.click(screen.getByTestId('login-fail-btn'))

        expect(screen.getByTestId('auth-status').textContent).toBe('LOGGED_OUT')
    })

    it('registers new user and logs them in', async () => {
        const user = userEvent.setup()
        render(
            <AuthProvider>
                <TestAuthConsumer />
            </AuthProvider>
        )

        await user.click(screen.getByTestId('register-new-btn'))

        expect(screen.getByTestId('auth-status').textContent).toBe('LOGGED_IN')
        expect(screen.getByTestId('user-email').textContent).toBe(
            'newreader@bookhaven.in'
        )
    })

    it('clears session on logout', async () => {
        const user = userEvent.setup()
        render(
            <AuthProvider>
                <TestAuthConsumer />
            </AuthProvider>
        )

        await user.click(screen.getByTestId('login-demo-btn'))
        expect(screen.getByTestId('auth-status').textContent).toBe('LOGGED_IN')

        await user.click(screen.getByTestId('logout-btn'))
        expect(screen.getByTestId('auth-status').textContent).toBe('LOGGED_OUT')
    })
})
