import { NudgeFormData, ApiResponse } from '../types';

export const fetchBusinessUnits = async (): Promise<ApiResponse<string[]>> => {
  // Mock API call - replace with actual API call
  return {
    success: true,
    data: ['Sales', 'Marketing', 'Engineering', 'HR', 'Finance'],
  };
};

export const fetchVerticals = async (): Promise<ApiResponse<string[]>> => {
  // Mock API call - replace with actual API call
  return {
    success: true,
    data: ['All', 'E-commerce', 'SaaS', 'Fintech', 'Healthcare'],
  };
};

export const fetchNudgeRules = async (): Promise<ApiResponse<string[]>> => {
  // Mock API call - replace with actual API call
  return {
    success: true,
    data: ['Welcome Message', 'Reminder', 'Follow-up', 'Feedback Request', 'Promotional'],
  };
};

export const fetchFrequencies = async (): Promise<ApiResponse<string[]>> => {
  // Mock API call - replace with actual API call
  return {
    success: true,
    data: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'One-time'],
  };
};

export const fetchPriorities = async (): Promise<ApiResponse<string[]>> => {
  // Mock API call - replace with actual API call
  return {
    success: true,
    data: ['High', 'Medium', 'Low'],
  };
};

export const fetchDateRangePresets = async (): Promise<ApiResponse<string[]>> => {
  // Mock API call - replace with actual API call
  return {
    success: true,
    data: ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Custom range'],
  };
};

export const fetchNudgeData = async (id: string): Promise<ApiResponse<NudgeFormData>> => {
  // Mock API call - replace with actual API call
  return {
    success: true,
    data: {
      businessUnit: '',
      vertical: '',
      nudgeName: '',
      nudgeRule: '',
      description: '',
      startDate: null,
      endDate: null,
      timeOfDay: '',
      frequency: '',
      priority: '',
      coolOffPeriod: '',
      status: 'Draft',
      dateRangeSelector: '',
      targetStartDate: null,
      targetEndDate: null,
      channels: [],
      channelContent: '',
    },
  };
};

export const submitNudgeData = async (data: NudgeFormData): Promise<ApiResponse<any>> => {
  // Mock API call - replace with actual API call
  console.log('Submitting data:', data);
  
  return {
    success: true,
    data: { id: '123456' },
    message: 'Nudge created successfully',
  };
};