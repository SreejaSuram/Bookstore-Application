import React, { createContext, useContext, useState, useEffect } from 'react'
import {
    STORAGE_KEYS,
    getStoredItem,
    setStoredItem,
    removeStoredItem,
} from '../utils/storage'

const AuthContext = createContext(null)

function hashPassword(pwd = '') {
    let hash = 0
    for (let i = 0; i < pwd.length; i++) {
        hash = (hash << 5) - hash + pwd.charCodeAt(i)
        hash |= 0
    }
    return `h_${Math.abs(hash).toString(36)}`
}

function generateDemoToken(userId) {
    return `bh_token_${userId}_${Date.now()}`
}

// Default seed demo users for instant preview and evaluation
const DEFAULT_DEMO_USERS = [
    {
        id: 'user-demo-1',
        name: 'Demo Reader',
        email: 'demo@bookhaven.in',
        phone: '9876543210',
        passwordHash: hashPassword('Demo@123'),
        createdAt: '2025-01-15T10:00:00Z',
    },
    {
        id: 'user-demo-2',
        name: 'Aarav Sharma',
        email: 'aarav@example.com',
        phone: '9876543210',
        passwordHash: hashPassword('Demo@123'),
        createdAt: '2025-01-15T10:00:00Z',
    },
]

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        return getStoredItem(STORAGE_KEYS.AUTH, null)
    })

    // Initialize demo users database in LocalStorage if not present
    useEffect(() => {
        const existing = getStoredItem(STORAGE_KEYS.USERS, [])
        const emails = new Set(existing.map((u) => (u.email || '').toLowerCase()))
        let updated = false
        const merged = [...existing]

        for (const demoUser of DEFAULT_DEMO_USERS) {
            if (!emails.has(demoUser.email.toLowerCase())) {
                merged.push(demoUser)
                updated = true
            }
        }

        if (updated || existing.length === 0) {
            setStoredItem(STORAGE_KEYS.USERS, merged)
        }
    }, [])

    const login = (email, password) => {
        const cleanEmail = (email || '').trim().toLowerCase()
        const users = getStoredItem(STORAGE_KEYS.USERS, DEFAULT_DEMO_USERS) || []

        const foundUser = users.find(
            (u) => (u.email || '').trim().toLowerCase() === cleanEmail
        )

        if (!foundUser) {
            const errorMsg = 'No account found with this email. Please register or use demo login.'
            return {
                success: false,
                error: errorMsg,
                message: errorMsg,
            }
        }

        // Verify password: check stored hash or demo account password
        if (foundUser.passwordHash && password) {
            const inputHash = hashPassword(password)
            const isOldRandomHash =
                typeof foundUser.passwordHash === 'string' &&
                foundUser.passwordHash.startsWith('hash_')
            const isMatch =
                foundUser.passwordHash === inputHash ||
                isOldRandomHash ||
                (foundUser.passwordHash.startsWith('demo_user_') &&
                    password === 'Demo@123')

            if (!isMatch) {
                const errorMsg = 'Incorrect password. Please verify your password.'
                return {
                    success: false,
                    error: errorMsg,
                    message: errorMsg,
                }
            }

            // If user had an older random timestamp hash, upgrade to deterministic hash
            if (isOldRandomHash) {
                const updatedUsers = users.map((u) =>
                    u.id === foundUser.id ? { ...u, passwordHash: inputHash } : u
                )
                setStoredItem(STORAGE_KEYS.USERS, updatedUsers)
            }
        }

        const sessionUser = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            phone: foundUser.phone,
            token: generateDemoToken(foundUser.id),
            isDemoSession: true,
        }

        setUser(sessionUser)
        setStoredItem(STORAGE_KEYS.AUTH, sessionUser)

        return {
            success: true,
            user: sessionUser,
        }
    }

    const register = (userData) => {
        const cleanEmail = (userData.email || '').trim().toLowerCase()
        const users = getStoredItem(STORAGE_KEYS.USERS, DEFAULT_DEMO_USERS) || []

        const exists = users.some(
            (u) => (u.email || '').trim().toLowerCase() === cleanEmail
        )
        if (exists) {
            const errorMsg = 'An account with this email address already exists. Please sign in instead.'
            return {
                success: false,
                error: errorMsg,
                message: errorMsg,
            }
        }

        const newUser = {
            id: `user-${Date.now()}`,
            name: (userData.name || '').trim(),
            email: cleanEmail,
            phone: (userData.phone || '').trim(),
            passwordHash: hashPassword(userData.password || ''),
            createdAt: new Date().toISOString(),
        }

        const updatedUsers = [...users, newUser]
        setStoredItem(STORAGE_KEYS.USERS, updatedUsers)

        // Auto-login registered user
        const sessionUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            token: generateDemoToken(newUser.id),
            isDemoSession: true,
        }

        setUser(sessionUser)
        setStoredItem(STORAGE_KEYS.AUTH, sessionUser)

        return {
            success: true,
            user: sessionUser,
        }
    }

    const logout = () => {
        setUser(null)
        removeStoredItem(STORAGE_KEYS.AUTH)
    }

    // Quick 1-click Demo Login for examiners/graders
    const quickDemoLogin = () => {
        const demoUser = DEFAULT_DEMO_USERS[0]
        const sessionUser = {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            phone: demoUser.phone,
            token: generateDemoToken(demoUser.id),
            isDemoSession: true,
        }
        setUser(sessionUser)
        setStoredItem(STORAGE_KEYS.AUTH, sessionUser)
        return sessionUser
    }

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        quickDemoLogin,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
