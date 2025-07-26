import { Nullable } from '@/shared/models/common.models';

export interface BookingFormInitValues {
  name: Nullable<string>;
  email: Nullable<string>;
  workspaceId: Nullable<string>;
  workspaceName: Nullable<string>;
  deskCount: Nullable<number>;
  roomCapacity: Nullable<number>;
  startDate: Nullable<string | Date>;
  endDate: Nullable<string | Date>;
  startTime: Nullable<string | Date>;
  endTime: Nullable<string | Date>;
}

export interface BookingFormValues {
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

export interface AvailableWorkspaceResponse {
  id: string;
  name: string;
  deskCount: number;
  roomCapacities: number[];
}
