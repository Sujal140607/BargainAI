import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../../services/api/rtkBaseQuery";

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery,
  endpoints: (builder) => ({
    getMyAnalytics: builder.query({
      query: ({ days } = {}) =>
        days ? `/users/me/analytics?days=${days}` : "/users/me/analytics",
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetMyAnalyticsQuery } = analyticsApi;
