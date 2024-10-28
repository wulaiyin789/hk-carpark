import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Button } from '@radix-ui/themes'

// Lib
import { getCombinedCarParkData } from '../../lib/api'
import { Link } from '@/src/i18n/routing'

// Types
import { Locale } from '@/src/i18n/request'

// export async function generateStaticParams() {
//   const carParks = await getCombinedCarParkData('zh_TW')
//   return carParks.map((carPark) => ({
//     id: carPark.park_Id,
//   }))
// }

export default async function CarParkPage({ params: { id, locale } }: { params: { id: string; locale: Locale } }) {
  const t = await getTranslations('carParkDetails')
  const newLocale = locale.replace('-', '_')
  const carParks = await getCombinedCarParkData(newLocale)
  const carPark = carParks.find((cp) => cp.park_Id === id)

  if (!carPark) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{carPark.name}</h1>
      <div className="bg-white text-gray-600 shadow-md rounded-lg p-6">
        <p className="mb-2">
          <strong>{t('address')}:</strong> {carPark.displayAddress}
        </p>
        <p className="mb-2">
          <strong>{t('district')}:</strong> {carPark.district}
        </p>
        <p className="mb-2">
          <strong>{t('contact')}:</strong> {carPark.contactNo}
        </p>
        <p className="mb-2">
          <strong>{t('website')}:</strong>{' '}
          <a href={carPark.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {carPark.website}
          </a>
        </p>
        <p className="mb-2">
          <strong>{t('openingStatus')}:</strong> {carPark.opening_status}
        </p>
        <p className="mb-2">
          <strong>{t('facilities')}:</strong> {carPark.facilities?.join(', ')}
        </p>
        <p className="mb-2">
          <strong>{t('paymentMethods')}:</strong> {carPark.paymentMethods?.join(', ')}
        </p>
        <h2 className="text-xl font-semibold mt-4 mb-2">{t('vacancies')}</h2>
        <ul className="list-disc pl-5 mb-4 text-gray-600">
          <li>
            {t('privateCar')}: {carPark.vacancy.privateCar?.[0]?.vacancy || 'N/A'}
          </li>
          <li>
            {t('lgv')}: {carPark.vacancy.LGV?.[0]?.vacancy || 'N/A'}
          </li>
          <li>
            {t('hgv')}: {carPark.vacancy.HGV?.[0]?.vacancy || 'N/A'}
          </li>
          <li>
            {t('motorcycle')}: {carPark.vacancy.motorCycle?.[0]?.vacancy || 'N/A'}
          </li>
        </ul>
        <Link href={`/`} className="text-gray-600">
          <Button>{t('backToMap')}</Button>
        </Link>
      </div>
    </div>
  )
}
