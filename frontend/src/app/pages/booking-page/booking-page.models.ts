import { Nullable } from '@/shared/models/common.models';

export interface BookWorkspaceRequest {
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
