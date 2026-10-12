import React from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBar({
    value,
    onChange,
    onClear,
    placeholder = 'Search by book title, author, or genre...',
}) {
    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                maxWidth: '540px',
            }}
        >
            <Search
                size={18}
                color="var(--text-muted)"
                style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                }}
            />
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-label="Search bookstore catalogue"
                data-testid="catalogue-search-input"
                className="form-input"
                style={{
                    paddingLeft: '42px',
                    paddingRight: value ? '40px' : '16px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-surface)',
                    fontSize: '0.95rem',
                }}
            />
            {value && (
                <button
                    type="button"
                    onClick={onClear}
                    aria-label="Clear search input"
                    style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <X size={16} />
                </button>
            )}
        </div>
    )
}
