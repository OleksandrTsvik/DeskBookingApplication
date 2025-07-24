export interface BookedWorkspaceResponse {
  id: string;
  name: string;
  photo?: string;
  deskCount?: number;
  roomCapacity?: number;
  startTime: Date;
  endTime: Date;
}
