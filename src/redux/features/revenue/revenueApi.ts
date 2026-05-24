import { baseApi } from "../../base/baseAPI";

const revenueApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRevenueStats: build.query({
      query: () => `/analytics/revenue-stats`,
    //   providesTags: ['revenue'],
      transformResponse: (response: { data: any }) => response.data,
    }),
    getMonthlyRevenueStats: build.query({
      query: (year?: string) => `/analytics/revenue-monthly-stats${year ? `?year=${year}` : ''}`,
      transformResponse: (response: { data: any }) => response.data,
    }),
    getRecentTransactions: build.query({
      query: (limit = 5) => `/transactions?limit=${limit}`,
      transformResponse: (response: { data: any }) => response.data,
    }),
  }),
});

export const { 
  useGetRevenueStatsQuery, 
  useGetMonthlyRevenueStatsQuery,
  useGetRecentTransactionsQuery
} = revenueApi;
