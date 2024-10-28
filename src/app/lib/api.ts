// Types
import { CarParkInfo, CarParkVacancy, CombinedCarParkData } from '../types/carpark';

export async function fetchCarParkInfo(lang: string): Promise<CarParkInfo[]> {
  const response = await fetch(`https://api.data.gov.hk/v1/carpark-info-vacancy?lang=${lang}`);
  if (!response.ok) {
    throw new Error('Failed to fetch car park info');
  }
  const data = await response.json();
  return data.results;
}

export async function fetchCarParkVacancy(): Promise<CarParkVacancy[]> {
  const response = await fetch('https://api.data.gov.hk/v1/carpark-info-vacancy?data=vacancy');
  if (!response.ok) {
    throw new Error('Failed to fetch car park vacancy');
  }
  const data = await response.json();
  return data.results;
}

export async function getCombinedCarParkData(lang: string): Promise<CombinedCarParkData[]> {
  const [carParkInfo, carParkVacancy] = await Promise.all([
    fetchCarParkInfo(lang),
    fetchCarParkVacancy()
  ]);

  const vacancyMap = new Map(carParkVacancy.map(v => [v.park_Id, v]));

  return carParkInfo.map(info => ({
    ...info,
    vacancy: vacancyMap.get(info.park_Id) || {
      park_Id: info.park_Id,
      privateCar: [],
      LGV: [],
      HGV: [],
      motorCycle: []
    }
  }));
}