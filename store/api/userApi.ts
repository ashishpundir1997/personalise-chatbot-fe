import { baseApi } from './baseApi';
import type { UserProfileResponse } from '@/lib/types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfileResponse, void>({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
} = userApi;
