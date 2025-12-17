# Enhanced use-table.ts Usage Examples

## Basic Usage (Backward Compatible)

```typescript
'use client'

import { useTableState } from '@/lib/use-table'

export default function CafesPage() {
  const { 
    page, 
    limit,
    setPage, 
    setLimit,
    setSearch,
    setSort,
    setFilter 
  } = useTableState()

  return (
    <DataTable 
      page={page}
      onPageChange={setPage}
      onSort={setSort}
    />
  )
}
```

## Type-Safe Filters (Recommended)

```typescript
'use client'

import { useTableState } from '@/lib/use-table'
import { type CafeQuery } from '@/schemas/cafes.dto'

// Define your filter schema
interface CafeFilters {
  region: string[]
  cafeType: string[]
  priceRange: string[]
  facilities: string[]
  contentStatus: string[]
}

export default function SearchPage() {
  const {
    // State
    page,
    limit,
    search,
    sortKey,
    sortDir,
    isPending,
    
    // Basic actions
    setPage,
    setSearch,
    setSort,
    
    // Type-safe actions
    getFilter,
    setFilters,
    clearFilters,
    getActiveFilters,
  } = useTableState<CafeFilters>()

  // Get typed filter values
  const regions = getFilter<string[]>('region') || []
  const cafeTypes = getFilter<string[]>('cafeType') || []
  
  // Batch update multiple filters at once
  const handleQuickFilter = () => {
    setFilters({
      region: ['sukabirus'],
      cafeType: ['indoor_cafe'],
      priceRange: ['murah'],
    })
  }
  
  // Update single filter
  const handleRegionChange = (values: string[]) => {
    setFilters({ region: values })
  }
  
  // Get all active filters
  const activeFilters = getActiveFilters()
  console.log('Active filters:', activeFilters)
  // { region: ['sukabirus'], priceRange: ['murah'] }
  
  // Clear specific filters
  const handleClearFilters = () => {
    clearFilters(['region', 'priceRange'])
  }
  
  // Clear all filters
  const handleResetAll = () => {
    clearFilters()
  }
  
  return (
    <div>
      {isPending && <LoadingSpinner />}
      
      <FilterPanel 
        regions={regions}
        cafeTypes={cafeTypes}
        onRegionChange={handleRegionChange}
        onQuickFilter={handleQuickFilter}
        onClearFilters={handleClearFilters}
        onResetAll={handleResetAll}
      />
      
      <ResultsList />
    </div>
  )
}
```

## Complex Tiket.com-Style Filters

```typescript
'use client'

import { useTableState } from '@/lib/use-table'

interface FlightSearchFilters {
  from: string
  to: string
  date: string
  returnDate: string
  adults: number
  children: number
  class: string
  airlines: string[]  // ['GA', 'ID', 'SJ']
  priceMin: number
  priceMax: number
  stops: string[]
  departure: string[]  // ['morning', 'afternoon']
}

export default function FlightSearch() {
  const {
    setFilters,
    getFilter,
    clearFilters,
  } = useTableState<FlightSearchFilters>()

  // URL will be:
  // /search?from=CGK&to=DPS&date=2024-01-15&
  // airlines=GA,ID&priceMin=500000&priceMax=2000000&
  // stops=direct&departure=morning,afternoon
  
  const handleSearch = () => {
    setFilters({
      from: 'CGK',
      to: 'DPS',
      date: '2024-01-15',
      returnDate: '2024-01-20',
      adults: 2,
      children: 1,
      class: 'economy',
      airlines: ['GA', 'ID'],
      priceMin: 500000,
      priceMax: 2000000,
      stops: ['direct'],
      departure: ['morning', 'afternoon'],
    })
  }
  
  // Get values back
  const airlines = getFilter<string[]>('airlines')
  // ['GA', 'ID']
  
  const priceMin = getFilter<number>('priceMin')
  // 500000
  
  return (
    <button onClick={handleSearch}>
      Search Flights
    </button>
  )
}
```

## Features

### ✅ Type-Safe
- Generic types for your filter schema
- Autocomplete for filter keys
- Type inference for getFilter

### ✅ Performance
- Memoized values to prevent re-renders
- Batch updates with setFilters
- useTransition for smooth UI
- Shallow routing (no page reload)

### ✅ Simple API
- `getFilter<T>(key)` - Get typed filter value
- `setFilters(filters)` - Batch update
- `clearFilters(keys?)` - Clear specific or all filters
- `getActiveFilters()` - Get all active filters

### ✅ URL Serialization
- Arrays: `airlines=GA,ID,SJ`
- Numbers: `price=50000`
- Strings: `region=sukabirus`
- Auto-parsing on read

### ✅ Backward Compatible
- Existing code continues to work
- No breaking changes
- Gradual adoption possible
