import { baseApi } from './baseApi';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '@/lib/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: (data) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store token and user in localStorage
          if (typeof window !== 'undefined' && data.data?.access_token) {
            localStorage.setItem('authToken', data.data.access_token);
            localStorage.setItem('refreshToken', data.data.refresh_token);
          }
        } catch (error) {
          console.error('Email verification failed:', error);
        }
      },
    }),
    
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store token in localStorage
          if (typeof window !== 'undefined' && data.data.access_token) {
            localStorage.setItem('authToken', data.data.access_token);
            localStorage.setItem('refreshToken', data.data.refresh_token);
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useLoginMutation,
} = authApi;
