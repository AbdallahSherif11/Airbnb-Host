export interface DetailedReadBookingDTO {
    bookingId: number;
    guestName: string;
    guestEmail: string;
    houseTitle: string;
    houseAddress: string;
    checkInDate: Date;
    checkOutDate: Date;
    totalPrice: number;
    paymentMethod: string;
    createdAt: Date;
    guestId: string;
    houseId: number;
  }