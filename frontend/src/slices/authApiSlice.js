import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, clearCredentials } from "./authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
});

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["User", "Notice", "Query"],

  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const user = data.user ?? data.data?.user;

          if (user) {
            dispatch(setCredentials(user));
          }
        } catch {
          // Login errors are handled by the component.
        }
      },

      invalidatesTags: ["User"],
    }),

    getMe: builder.query({
      query: () => "/auth/me",

      transformResponse: (response) =>
        response.user ?? response.data?.user ?? response,

      providesTags: ["User"],

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          dispatch(clearCredentials());
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearCredentials());
        }
      },

      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApiSlice;
