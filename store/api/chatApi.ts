import { baseApi } from './baseApi';
import type { 
  ConversationsResponse, 
  ConversationsRequest,
  ConversationDetailsResponse,
  ConversationDetailsRequest
} from '@/lib/types';

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
    getConversationDetails: builder.query<ConversationDetailsResponse, ConversationDetailsRequest>({
      query: ({ conversation_id, include_messages = true, limit = 25, cursor }) => ({
        url: `/chat/conversation/${conversation_id}`,
        params: {
          include_messages,
          limit,
          ...(cursor && { cursor }),
        },
      }),
      providesTags: (result, error, arg) => [{ type: 'Chat', id: arg.conversation_id }],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationDetailsQuery,
} = chatApi;
