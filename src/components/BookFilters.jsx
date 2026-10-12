import React from 'react'
import { Filter, RotateCcw, Star } from 'lucide-react'
import { CATEGORIES } from '../data/books'
import { formatINR } from '../utils/pricing'

export default function BookFilters({
    selectedCategory,
    onSelectCategory,
    priceRange,
    onPriceChange,
    minRating,
    onRatingChange,
    sortBy,
    onSortChange,
    onClearFilters,
    hasActiveFilters,
    categoryCounts = {},
    maxPrice = 2000,
}) {
    return (
        <aside
            className="card"
            style={{
                padding: '1.5rem',
                height: 'fit-content',
                position: 'sticky',
                top: '90px',
            }}
            aria-label="Filter book catalogue"
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid var(--border)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={18} color="var(--primary)" />
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Filters</h2>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
                        title="Clear all applied filters"
                        data-testid="clear-filters-btn"
                    >
                        <RotateCcw size={12} /> Clear All
                    </button>
                )}
            </div>

            {/* Sort By Dropdown (visible in filters on mobile / desktop) */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="filter-sort" className="form-label">
                    Sort Catalog By
                </label>
                <select
                    id="filter-sort"
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="form-select"
                    data-testid="sort-select"
                >
                    <option value="featured">Featured & Popular</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="title-asc">Alphabetical (A - Z)</option>
                    <option value="title-desc">Alphabetical (Z - A)</option>
                </select>
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '1.75rem' }}>
                <h3
                    style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--text-secondary)',
                        marginBottom: '0.75rem',
                    }}
                >
                    Categories
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat
                        const count = categoryCounts[cat] ?? 0
                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => onSelectCategory(cat)}
                                data-testid={`category-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.45rem 0.65rem',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: isSelected
                                        ? 'var(--primary-subtle)'
                                        : 'transparent',
                                    color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                                    fontWeight: isSelected ? 600 : 500,
                                    fontSize: '0.9rem',
                                    textAlign: 'left',
                                    transition: 'background-color 0.15s',
                                }}
                            >
                                <span>{cat}</span>
                                <span
                                    style={{
                                        fontSize: '0.75rem',
                                        color: isSelected ? 'var(--primary)' : 'var(--text-light)',
                                        backgroundColor: isSelected
                                            ? 'var(--primary-light)'
                                            : 'var(--bg-surface-subtle)',
                                        padding: '0.1rem 0.45rem',
                                        borderRadius: 'var(--radius-full)',
                                    }}
                                >
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Price Range Filter */}
            <div style={{ marginBottom: '1.75rem' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                    }}
                >
                    <h3
                        style={{
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        Max Price
                    </h3>
                    <span
                        style={{
                            fontWeight: 700,
                            color: 'var(--primary)',
                            fontSize: '0.95rem',
                        }}
                    >
                        {formatINR(priceRange)}
                    </span>
                </div>
                <input
                    type="range"
                    min="200"
                    max={maxPrice}
                    step="50"
                    value={priceRange}
                    onChange={(e) => onPriceChange(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                    aria-label="Filter by maximum price"
                    data-testid="price-range-slider"
                />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        marginTop: '0.3rem',
                    }}
                >
                    <span>₹200</span>
                    <span>{formatINR(maxPrice)}</span>
                </div>
            </div>

            {/* Rating Filter */}
            <div>
                <h3
                    style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--text-secondary)',
                        marginBottom: '0.75rem',
                    }}
                >
                    Minimum Rating
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {[
                        { label: 'All Ratings', value: 0 },
                        { label: '4.5 ★ & above', value: 4.5 },
                        { label: '4.7 ★ & above', value: 4.7 },
                        { label: '4.8 ★ & above', value: 4.8 },
                    ].map((item) => (
                        <label
                            key={item.value}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                color:
                                    minRating === item.value ? 'var(--primary)' : 'var(--text-main)',
                                fontWeight: minRating === item.value ? 600 : 400,
                            }}
                        >
                            <input
                                type="radio"
                                name="minRating"
                                checked={minRating === item.value}
                                onChange={() => onRatingChange(item.value)}
                                style={{ accentColor: 'var(--primary)' }}
                                data-testid={`rating-filter-${item.value}`}
                            />
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                {item.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    )
}
