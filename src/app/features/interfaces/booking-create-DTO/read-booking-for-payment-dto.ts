export interface ReadBookingForPaymentDTO {
  bookingId: number;
  totalPrice: number;
  checkInDate: string;  // or Date if you prefer
  checkOutDate: string;
  guestName: string;
}