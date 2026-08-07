import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../../services/api/rtkBaseQuery";

export const leaderboardApi = createApi({
  reducerPath: "leaderboardApi",
  baseQuery,
  tagTypes: ["Leaderboard"],
  endpoints: (builder) => ({
    getLeaderboard: builder.query({
      query: ({ limit = 100, page = 1 } = {}) =>
        `/leaderboard?limit=${limit}&page=${page}`,
      transformResponse: (response) => response.data,
      providesTags: ["Leaderboard"],
    }),
  }),
});

export const { useGetLeaderboardQuery } = leaderboardApi;
