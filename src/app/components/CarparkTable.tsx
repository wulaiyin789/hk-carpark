'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@radix-ui/themes'

// Components
import { Input } from './ui/Input'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/Table'

// Types
import { CombinedCarParkData } from '../types/carpark'
import { Link } from '@/src/i18n/routing'

type CarParkTableProps = {
  carParks: CombinedCarParkData[]
  onSelectCarPark: (carPark: CombinedCarParkData) => void
}

export default function CarParkTable({ carParks, onSelectCarPark }: CarParkTableProps) {
  const t = useTranslations('carParkTable')

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredCarParks = carParks.filter(
    (carPark) => carPark.name.toLowerCase().includes(searchTerm.toLowerCase()) || carPark.park_Id.includes(searchTerm)
  )

  const totalPages = Math.ceil(filteredCarParks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCarParks = filteredCarParks.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Input
          type="text"
          placeholder={t('search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky top-0 bg-background">{t('id')}</TableHead>
            <TableHead className="sticky top-0 bg-background">{t('name')}</TableHead>
            <TableHead className="sticky top-0 bg-background">{t('address')}</TableHead>
            <TableHead className="sticky top-0 bg-background">{t('vacancies')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCarParks.map((carPark) => (
            <TableRow
              key={carPark.park_Id}
              className="cursor-pointer transition-all hover:bg-muted"
              onClick={() => onSelectCarPark(carPark)}
            >
              <TableCell className="font-medium">
                <span className="px-2 py-1 bg-primary/10 rounded-md shadow-sm hover:shadow-md transition-shadow">
                  {carPark.park_Id}
                </span>
              </TableCell>
              <TableCell>
                <Link href={`/${carPark.park_Id}`} className="text-blue-500 hover:underline">
                  {carPark.name}
                </Link>
              </TableCell>
              <TableCell>{carPark.displayAddress}</TableCell>
              <TableCell>{carPark.vacancy.privateCar[0]?.vacancy || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center">
        <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
