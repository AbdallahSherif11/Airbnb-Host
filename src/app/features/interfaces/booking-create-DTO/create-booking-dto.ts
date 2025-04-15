export interface CreateBookingDto {
  houseId: number;
  // checkInDate: Date;
  // checkOutDate: Date;
  checkInDate: string;
  checkOutDate: string;
  paymentMethod: string;
}
