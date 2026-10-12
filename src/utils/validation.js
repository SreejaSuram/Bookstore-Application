/**
 * Input validation utilities tailored for Indian contact standards and authentication
 */

function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * 10-digit Indian Mobile Number validation (starting with 6, 7, 8, or 9)
 */
function isValidIndianPhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    const clean = phone.trim().replace(/^(\+91|0)/, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(clean);
}

/**
 * 6-digit Indian Postal PIN code validation (1-9 followed by 5 digits)
 */
function isValidIndianPin(pin) {
    if (!pin || typeof pin !== 'string') return false;
    const clean = pin.trim();
    const pinRegex = /^[1-9]\d{5}$/;
    return pinRegex.test(clean);
}

function isValidName(name) {
    if (!name || typeof name !== 'string') return false;
    return name.trim().length >= 2;
}

function isValidAddress(address) {
    if (!address || typeof address !== 'string') return false;
    return address.trim().length >= 8;
}

function isValidPassword(password) {
    if (!password || typeof password !== 'string') return false;
    return password.length >= 6;
}

/**
 * Validates the full checkout form
 */
function validateCheckoutForm(data = {}) {
    const errors = {};

    if (!isValidName(data.fullName)) {
        errors.fullName = 'Full name is required (at least 2 characters)';
    }

    if (!isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!isValidIndianPhone(data.phone)) {
        errors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!isValidAddress(data.address)) {
        errors.address = 'Street address must be at least 8 characters';
    }

    if (!data.city || data.city.trim().length < 2) {
        errors.city = 'City name is required';
    }

    if (!data.state || data.state.trim().length < 2) {
        errors.state = 'State / Union Territory is required';
    }

    if (!isValidIndianPin(data.pinCode)) {
        errors.pinCode = 'Please enter a valid 6-digit Indian PIN code';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

/**
 * Validates login form
 */
function validateLoginForm(data = {}) {
    const errors = {};

    if (!isValidEmail(data.email)) {
        errors.email = 'Please provide a valid email address';
    }

    if (!data.password || data.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

/**
 * Validates registration form
 */
function validateRegisterForm(data = {}) {
    const errors = {};

    if (!isValidName(data.name)) {
        errors.name = 'Full name must be at least 2 characters';
    }

    if (!isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!isValidIndianPhone(data.phone)) {
        errors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!isValidPassword(data.password)) {
        errors.password = 'Password must be at least 6 characters';
    }

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

export {
    isValidEmail,
    isValidIndianPhone,
    isValidIndianPin,
    isValidName,
    isValidAddress,
    isValidPassword,
    validateCheckoutForm,
    validateLoginForm,
    validateRegisterForm,
};
