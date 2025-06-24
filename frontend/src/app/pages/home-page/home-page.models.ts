export interface WorkspaceResponse {
  id: string;
  name: string;
  description: string;
  photos: string[];
  amenities: string[];
  deskCount: number;
  rooms: WorkspaceRoomResponse[];
}

export interface WorkspaceRoomResponse {
  count: number;
  capacity: number;
}
