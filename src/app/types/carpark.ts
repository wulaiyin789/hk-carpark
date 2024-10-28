export type Address = {
  floor: string;
  buildingName: string;
  streetName: string;
  buildingNo: string;
  subDistrict: string;
  dcDistrict: string;
  region: string;
};

export type RenditionUrls = {
  square: string;
  thumbnail: string;
  banner: string;
};

export type OpeningHours = {
  weekdays: string[];
  excludePublicHoliday: boolean;
  periodStart: string;
  periodEnd: string;
};

export type GracePeriod = {
  minutes: number;
};

export type HeightLimit = {
  height: number;
};

export type ParkingSpace = {
  spaceUNL: number;
  spaceEV: number;
  spaceDIS: number;
  space: number;
};

export type CarParkInfo = {
  park_Id: string;
  name: string;
  nature: string;
  carpark_Type: string;
  address: Address;
  displayAddress: string;
  district: string;
  latitude: number;
  longitude: number;
  contactNo: string;
  renditionUrls: RenditionUrls;
  website: string;
  opening_status: string;
  openingHours: OpeningHours[];
  gracePeriods: GracePeriod[];
  heightLimits: HeightLimit[];
  facilities: string[];
  paymentMethods: string[];
  privateCar: ParkingSpace;
  LGV: ParkingSpace;
  HGV: ParkingSpace;
  coach: ParkingSpace;
  motorCycle: ParkingSpace;
  creationDate: string;
  modifiedDate: string;
  publishedDate: string;
  lang: string;
};

export type VacancyInfo = {
  vacancy_type: string;
  vacancyEV?: number;
  vacancyDIS?: number;
  vacancy: number;
  lastupdate: string;
};

export type CarParkVacancy = {
  park_Id: string;
  privateCar: VacancyInfo[];
  LGV: VacancyInfo[];
  HGV: VacancyInfo[];
  motorCycle: VacancyInfo[];
};

export type CombinedCarParkData = CarParkInfo & {
  vacancy: CarParkVacancy;
};