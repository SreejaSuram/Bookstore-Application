import React from 'react'

export default function LoadingSpinner({ message = 'Loading books...', size = 'md' }) {
    const sizeMap = {
        sm: { width: 18, height: 18 },
        md: { width: 32, height: 32 },
        lg: { width: 48, height: 48 },
    }

    const dimension = sizeMap[size] || sizeMap.md

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 1rem',
                gap: '1rem',
            }}
            role="status"
        >
            <div
                className="spinner"
                style={{ width: dimension.width, height: dimension.height }}
            />
            {message && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    {message}
                </p>
            )}
        </div>
    )
}
