import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../../services/api/rtkBaseQuery";

export const statisticsApi = createApi({
  reducerPath: "statisticsApi",
  baseQuery,
  endpoints: (builder) => ({
    getMyStatistics: builder.query({
      query: () => "/users/me/statistics",
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetMyStatisticsQuery } = statisticsApi;
