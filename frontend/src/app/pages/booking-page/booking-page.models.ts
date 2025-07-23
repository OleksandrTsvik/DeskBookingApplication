import { Nullable } from '@/shared/models/common.models';

export interface BookableWorkspaceResponse {
  id: string;
  name: string;
  deskCount: number;
  roomCapacities: number[];
}

export interface BookWorkspaceRequest {
  name: Nullable<string>;
  email: Nullable<string>;
  workspaceId: Nullable<string>;
  deskCount: Nullable<number>;
  roomCapacity: Nullable<number>;
  startTime: Nullable<Date>;
  endTime: Nullable<Date>;
}
