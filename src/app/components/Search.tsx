'use client'

import { useState, useTransition } from 'react'
import { Button } from '@radix-ui/themes'

// Components
import { Input } from '../components/ui/Input'

// API
import { searchCarParks } from '../../app/actions'

// Types
import { CombinedCarParkData } from '../types/carpark'

export default function Search({ onSearch }: { onSearch: (results: CombinedCarParkData[]) => void }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const results = await searchCarParks(searchTerm)
      onSearch(results)
    })
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-4">
      <Input
        type="text"
        placeholder="Search carparks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Searching...' : 'Search'}
      </Button>
    </form>
  )
}
