import { Nullable } from '@/shared/models/common.models';

export interface BookedWorkspaceResponse {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  deskCount: number;
  roomCapacity: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface UpdateWorkspaceBookingRequest {
  id: string;
  name: Nullable<string>;
  email: Nullable<string>;
  workspaceId: Nullable<string>;
  deskCount: Nullable<number>;
  roomCapacity: Nullable<number>;
  startDate: Nullable<string>;
  endDate: Nullable<string>;
  startTime: Nullable<string>;
  endTime: Nullable<string>;
}
