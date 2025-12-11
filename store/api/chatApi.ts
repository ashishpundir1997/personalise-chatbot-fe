import { baseApi } from './baseApi';
import type { ConversationsResponse, ConversationsRequest } from '@/lib/types';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<ConversationsResponse, ConversationsRequest | undefined>({
      query: (params) => ({
        url: '/chat/conversations',
        params: {
          limit: params?.limit || 20,
          offset: params?.offset || 0,
        },
      }),
      providesTags: ['Chat'],
    }),
  }),
});

export const {
  useGetConversationsQuery,
} = chatApi;
