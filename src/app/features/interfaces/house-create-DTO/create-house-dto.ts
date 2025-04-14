export interface CreateHouseDTO {
    HostId?: string;
    title: string;
    description: string;
    pricePerNight: number;
    country: string;
    city: string;
    street: string;
    latitude: number;
    longitude: number;
    isAvailable: boolean;
    maxDays: number;
    maxGuests: number;
    houseView: string;
    numberOfRooms: number;
    numberOfBeds: number;
    imagesList: File[];
    amenitiesList: number[];
  }
