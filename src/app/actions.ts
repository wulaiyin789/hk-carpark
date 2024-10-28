'use server'

// Lib
import { getCombinedCarParkData } from './lib/api'

// Types
import { CombinedCarParkData } from './types/carpark'

export async function searchCarParks(searchTerm: string): Promise<CombinedCarParkData[]> {
  const allCarParks = await getCombinedCarParkData('zh_TW')
  return allCarParks.filter(carPark => 
    carPark.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carPark.park_Id.includes(searchTerm) ||
    carPark.displayAddress.toLowerCase().includes(searchTerm.toLowerCase())
  )
}

export async function getCarParkById(id: string): Promise<CombinedCarParkData | undefined> {
  const allCarParks = await getCombinedCarParkData('zh_TW')
  return allCarParks.find(carPark => carPark.park_Id === id)
}

export async function getCarParksByDistrict(district: string): Promise<CombinedCarParkData[]> {
  const allCarParks = await getCombinedCarParkData('zh_TW')
  return allCarParks.filter(carPark => carPark.district.toLowerCase() === district.toLowerCase())
}

export async function getCarParksWithVacancies(minVacancies: number): Promise<CombinedCarParkData[]> {
  const allCarParks = await getCombinedCarParkData('zh_TW')
  return allCarParks.filter(carPark => {
    const privateCarVacancy = carPark.vacancy.privateCar[0]?.vacancy || 0
    return privateCarVacancy >= minVacancies
  })
}