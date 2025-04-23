export interface FilterResult {
    Country: string | null;
    City: string | null;
    Rooms: number | null;
    Beds: number | null;
    Amenities: string[] | null;
    MinPrice: number | null;
    MaxPrice: number | null;
    HouseView: string | null;
  }