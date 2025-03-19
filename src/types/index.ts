export interface NudgeFormData {
    businessUnit: string;
    vertical: string;
    nudgeName: string;
    nudgeRule: string;
    description: string;
    startDate: Date | null;
    endDate: Date | null;
    timeOfDay: string;
    frequency: string;
    priority: string;
    coolOffPeriod: string;
    status: 'Draft' | 'Active' | 'Inactive';
    dateRangeSelector: string;
    targetStartDate: Date | null;
    targetEndDate: Date | null;
    channels: string[];
    channelContent: string;
  }
  
  export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
  }