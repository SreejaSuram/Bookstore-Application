import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BookOpen, SlidersHorizontal, RotateCcw } from 'lucide-react'
import BookCard from '../components/BookCard'
import SearchBar from '../components/SearchBar'
import BookFilters from '../components/BookFilters'
import { BOOKS, CATEGORIES } from '../data/books'

export default function BookListing() {
    const [searchParams, setSearchParams] = useSearchParams()

    const initialSearch = searchParams.get('search') || ''
    const initialCategory = searchParams.get('category') || 'All'

    const [searchTerm, setSearchTerm] = useState(initialSearch)
    const [selectedCategory, setSelectedCategory] = useState(initialCategory)
    const [priceRange, setPriceRange] = useState(2000)
    const [minRating, setMinRating] = useState(0)
    const [sortBy, setSortBy] = useState('featured')
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

    // Sync state with URL params if they change
    useEffect(() => {
        const urlSearch = searchParams.get('search')
        const urlCategory = searchParams.get('category')
        if (urlSearch !== null) setSearchTerm(urlSearch)
        if (urlCategory !== null && CATEGORIES.includes(urlCategory)) {
            setSelectedCategory(urlCategory)
        }
    }, [searchParams])

    // Category counts
    const categoryCounts = useMemo(() => {
        const counts = { All: BOOKS.length }
        CATEGORIES.forEach((cat) => {
            if (cat !== 'All') {
                counts[cat] = BOOKS.filter((b) => b.category === cat).length
            }
        })
        return counts
    }, [])

    // Filtered and sorted books
    const filteredBooks = useMemo(() => {
        return BOOKS.filter((book) => {
            // Search term filter (title, author, category)
            if (searchTerm.trim()) {
                const query = searchTerm.toLowerCase().trim()
                const matchesTitle = book.title.toLowerCase().includes(query)
                const matchesAuthor = book.author.toLowerCase().includes(query)
                const matchesCategory = book.category.toLowerCase().includes(query)
                if (!matchesTitle && !matchesAuthor && !matchesCategory) return false
            }

            // Category filter
            if (selectedCategory !== 'All' && book.category !== selectedCategory) {
                return false
            }

            // Price range filter
            if (book.price > priceRange) {
                return false
            }

            // Rating filter
            if (minRating > 0 && book.rating < minRating) {
                return false
            }

            return true
        }).sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price - b.price
                case 'price-desc':
                    return b.price - a.price
                case 'rating-desc':
                    return b.rating - a.rating || b.reviewCount - a.reviewCount
                case 'title-asc':
                    return a.title.localeCompare(b.title)
                case 'title-desc':
                    return b.title.localeCompare(a.title)
                case 'featured':
                default:
                    if (a.featured && !b.featured) return -1
                    if (!a.featured && b.featured) return 1
                    if (a.bestseller && !b.bestseller) return -1
                    if (!a.bestseller && b.bestseller) return 1
                    return b.rating - a.rating
            }
        })
    }, [searchTerm, selectedCategory, priceRange, minRating, sortBy])

    const hasActiveFilters =
        searchTerm !== '' ||
        selectedCategory !== 'All' ||
        priceRange < 2000 ||
        minRating > 0 ||
        sortBy !== 'featured'

    const handleClearFilters = () => {
        setSearchTerm('')
        setSelectedCategory('All')
        setPriceRange(2000)
        setMinRating(0)
        setSortBy('featured')
        setSearchParams({})
    }

    const handleCategorySelect = (category) => {
        setSelectedCategory(category)
        if (category === 'All') {
            searchParams.delete('category')
        } else {
            searchParams.set('category', category)
        }
        setSearchParams(searchParams)
    }

    const handleSearchChange = (term) => {
        setSearchTerm(term)
        if (term) {
            searchParams.set('search', term)
        } else {
            searchParams.delete('search')
        }
        setSearchParams(searchParams)
    }

    return (
        <div className="book-listing-page" style={{ padding: '2.5rem 0 4.5rem' }}>
            <div className="container">
                {/* Page Header */}
                <div
                    style={{
                        marginBottom: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}
                >
                    <div>
                        <h1 className="heading-section">Browse Book Catalogue</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            Explore our complete selection of curated titles, from timeless
                            classics to current bestsellers.
                        </p>
                    </div>

                    {/* Search Bar & Mobile Filter Trigger */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                        }}
                    >
                        <SearchBar
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onClear={() => handleSearchChange('')}
                            placeholder="Search by title, author, or genre..."
                        />

                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                            className="btn btn-secondary btn-sm"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                            }}
                            aria-label="Toggle filter sidebar"
                        >
                            <SlidersHorizontal size={16} /> Filters
                            {hasActiveFilters && (
                                <span className="badge badge-primary">Active</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Metadata Bar */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1.5rem',
                        paddingBottom: '0.75rem',
                        borderBottom: '1px solid var(--border-subtle)',
                    }}
                >
                    <p
                        style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}
                        data-testid="books-count-status"
                    >
                        Showing <strong>{filteredBooks.length}</strong> of{' '}
                        <strong>{BOOKS.length}</strong> books
                        {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
                        {searchTerm && ` matching "${searchTerm}"`}
                    </p>

                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            style={{
                                fontSize: '0.85rem',
                                color: 'var(--primary)',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                            data-testid="clear-all-link"
                        >
                            <RotateCcw size={14} /> Clear all filters
                        </button>
                    )}
                </div>

                {/* Main Content: Sidebar + Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(240px, 280px) 1fr',
                        gap: '2rem',
                        alignItems: 'start',
                    }}
                    className="catalog-layout"
                >
                    {/* Filter Sidebar (Desktop & Mobile modal/toggle) */}
                    <div
                        className={`filters-wrapper ${mobileFiltersOpen ? 'filters-mobile-open' : ''
                            }`}
                    >
                        <BookFilters
                            selectedCategory={selectedCategory}
                            onSelectCategory={handleCategorySelect}
                            priceRange={priceRange}
                            onPriceChange={setPriceRange}
                            minRating={minRating}
                            onRatingChange={setMinRating}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            onClearFilters={handleClearFilters}
                            hasActiveFilters={hasActiveFilters}
                            categoryCounts={categoryCounts}
                        />
                    </div>

                    {/* Books Grid */}
                    <main aria-label="Book collection">
                        {filteredBooks.length > 0 ? (
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns:
                                        'repeat(auto-fill, minmax(240px, 1fr))',
                                    gap: '1.5rem',
                                }}
                                data-testid="books-catalogue-grid"
                            >
                                {filteredBooks.map((book) => (
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state" data-testid="no-books-found-state">
                                <BookOpen className="empty-state-icon" />
                                <h3 className="empty-state-title">No books match your criteria</h3>
                                <p className="empty-state-desc">
                                    We couldn't find any books matching your selected filters or
                                    search terms. Try widening your price range or clearing active
                                    filters.
                                </p>
                                <button
                                    onClick={handleClearFilters}
                                    className="btn btn-primary"
                                    data-testid="reset-filters-btn"
                                >
                                    <RotateCcw size={16} /> Reset All Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
