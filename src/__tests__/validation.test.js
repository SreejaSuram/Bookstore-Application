import { describe, it, expect } from 'vitest'
import {
    isValidEmail,
    isValidIndianPhone,
    isValidIndianPin,
    isValidName,
    isValidAddress,
    isValidPassword,
    validateCheckoutForm,
    validateLoginForm,
    validateRegisterForm,
} from '../utils/validation'

describe('Validation Utilities', () => {
    describe('Email validation', () => {
        it('accepts valid email addresses', () => {
            expect(isValidEmail('reader@bookhaven.in')).toBe(true)
            expect(isValidEmail('test.user+tag@domain.co.in')).toBe(true)
        })

        it('rejects invalid email formats', () => {
            expect(isValidEmail('invalid')).toBe(false)
            expect(isValidEmail('missing@domain')).toBe(false)
            expect(isValidEmail('')).toBe(false)
            expect(isValidEmail(null)).toBe(false)
        })
    })

    describe('Indian Phone number validation', () => {
        it('accepts valid 10-digit Indian phone numbers', () => {
            expect(isValidIndianPhone('9876543210')).toBe(true)
            expect(isValidIndianPhone('8123456789')).toBe(true)
            expect(isValidIndianPhone('7012345678')).toBe(true)
            expect(isValidIndianPhone('6398765432')).toBe(true)
            expect(isValidIndianPhone('+919876543210')).toBe(true)
        })

        it('rejects invalid numbers', () => {
            expect(isValidIndianPhone('1234567890')).toBe(false) // does not start with 6-9
            expect(isValidIndianPhone('98765')).toBe(false) // too short
            expect(isValidIndianPhone('987654321000')).toBe(false) // too long
            expect(isValidIndianPhone('abcdefghij')).toBe(false)
        })
    })

    describe('Indian Postal PIN code validation', () => {
        it('accepts valid 6-digit Indian PIN codes', () => {
            expect(isValidIndianPin('560001')).toBe(true)
            expect(isValidIndianPin('110001')).toBe(true)
            expect(isValidIndianPin('400001')).toBe(true)
        })

        it('rejects invalid PIN codes', () => {
            expect(isValidIndianPin('012345')).toBe(false) // starts with 0
            expect(isValidIndianPin('56000')).toBe(false) // 5 digits
            expect(isValidIndianPin('5600012')).toBe(false) // 7 digits
            expect(isValidIndianPin('ABCDEF')).toBe(false)
        })
    })

    describe('Checkout Form validation', () => {
        it('passes for valid complete Indian customer details', () => {
            const validData = {
                fullName: 'Aarav Patel',
                email: 'aarav@example.com',
                phone: '9876543210',
                address: '123 Koramangala 4th Block',
                city: 'Bengaluru',
                state: 'Karnataka',
                pinCode: '560034',
            }
            const result = validateCheckoutForm(validData)
            expect(result.isValid).toBe(true)
            expect(Object.keys(result.errors).length).toBe(0)
        })

        it('returns specific errors for incomplete checkout fields', () => {
            const invalidData = {
                fullName: 'A',
                email: 'invalid-email',
                phone: '123',
                address: 'Short',
                city: '',
                state: '',
                pinCode: '00',
            }
            const result = validateCheckoutForm(invalidData)
            expect(result.isValid).toBe(false)
            expect(result.errors.fullName).toBeDefined()
            expect(result.errors.email).toBeDefined()
            expect(result.errors.phone).toBeDefined()
            expect(result.errors.address).toBeDefined()
            expect(result.errors.city).toBeDefined()
            expect(result.errors.state).toBeDefined()
            expect(result.errors.pinCode).toBeDefined()
        })
    })

    describe('Login & Register form validation', () => {
        it('validates login form requiring email and 6-char password', () => {
            expect(validateLoginForm({ email: 'a@b.com', password: '123456' }).isValid).toBe(true)
            expect(validateLoginForm({ email: 'invalid', password: '123' }).isValid).toBe(false)
        })

        it('validates register form password matching and fields', () => {
            const valid = {
                name: 'Rohan Sharma',
                email: 'rohan@example.com',
                phone: '9876543210',
                password: 'Password123',
                confirmPassword: 'Password123',
            }
            expect(validateRegisterForm(valid).isValid).toBe(true)

            const mismatch = { ...valid, confirmPassword: 'DifferentPassword' }
            const res = validateRegisterForm(mismatch)
            expect(res.isValid).toBe(false)
            expect(res.errors.confirmPassword).toBe('Passwords do not match')
        })
    })
})
