export interface BookedWorkspaceResponse {
  id: string;
  name: string;
  photo?: string;
  deskCount?: number;
  roomCapacity?: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}
