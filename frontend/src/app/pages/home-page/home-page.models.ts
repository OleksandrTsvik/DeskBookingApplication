export interface WorkspaceResponse {
  id: string;
  name: string;
  description: string;
  photos: string[];
  amenities: string[];
  deskCount: number;
  rooms: WorkspaceRoomResponse[];
  userBooking?: UserBookingResponse;
}

export interface WorkspaceRoomResponse {
  count: number;
  capacity: number;
}

export interface UserBookingResponse {
  deskCount?: number;
  roomCapacity?: number;
  startDate: string;
  endDate: string;
}
