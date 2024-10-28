'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { Button } from '@radix-ui/themes'
// import { useSearchParams } from 'next/navigation'

// Components
import CarParkTable from '../components/CarparkTable'
import ThemeToggle from '../components/ThemeToggle'
const DynamicMap = dynamic(() => import('../components/Map'), { ssr: false })

// Lib
import { getCombinedCarParkData } from '../lib/api'
import { Link } from '@/src/i18n/routing'

// Types
import { CombinedCarParkData } from '../types/carpark'
import { Locale } from '@/src/i18n/request'

export default function Home({ params: { locale } }: { params: { locale: Locale } }) {
  const [carParks, setCarParks] = useState<CombinedCarParkData[]>([])
  const [selectedCarPark, setSelectedCarPark] = useState<CombinedCarParkData | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const t = useTranslations()
  // const searchParams = useSearchParams()
  // const lang = searchParams.get('lang') || 'zh-TW'

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const newLocale = locale.replace('-', '_')
        const data = await getCombinedCarParkData(newLocale)
        setCarParks(data)
      } catch (error) {
        console.error('Failed to fetch car park data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [locale])

  const handleSelectCarPark = (carPark: CombinedCarParkData) => {
    setSelectedCarPark(carPark)
  }

  // const changeLanguage = (newLang: string) => {
  //   const newUrl = new URL(window.location.href)
  //   newUrl.searchParams.set('lang', newLang)
  //   window.history.pushState({}, '', newUrl)
  //   window.location.reload()
  // }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row py-4 px-4">
        <div className="flex px-4 items-center">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
        <div className="flex flex-wrap px-4 items-center space-x-2">
          <Button>
            <Link href="en">{t('language.english')}</Link>
          </Button>
          <Button>
            <Link href="zh-CN">{t('language.simplifiedChinese')}</Link>
          </Button>
          <Button>
            <Link href="zh-TW">{t('language.traditionalChinese')}</Link>
          </Button>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
      <main className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div className="w-full md:w-1/3 h-1/2 md:h-full overflow-auto border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
          <CarParkTable carParks={carParks} onSelectCarPark={handleSelectCarPark} />
        </div>
        <div className="w-full md:w-2/3 h-1/2 md:h-full">
          <DynamicMap carParks={carParks} selectedCarPark={selectedCarPark} />
        </div>
      </main>
    </div>
  )
}
