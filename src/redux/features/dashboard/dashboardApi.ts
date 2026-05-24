import { baseApi } from "../../base/baseAPI";

const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder)=>({
        getAnalytics:  builder.query({
            query: ()=>`/analytics/stat-counts`,
            transformResponse: (res: {data: any})=> res?.data,
        }),
        getUsersGrowth:  builder.query({
            query: ()=>`/analytics/admin-user-growth-chart`,
            transformResponse: (res: {data: any})=> res?.data,
        }),
        getOverView: builder.query({
            query: ()=>`/analytics/overview`,
            transformResponse: (res: {data: any})=> res?.data
        }),
        getRevenueGrowth: builder.query({
            query: (year)=>`/analytics/yearly-revenue-chart?year=${year}`,
            transformResponse: (res: {data: any})=> res?.data
        }),
        getBookingUsersGrowth: builder.query({
            query: (year)=>`/analytics/yearly-booking-user-chart?year=${year}`,
            transformResponse: (res: {data: any})=> res?.data
        }),
        getActiveListings: builder.query({
            query: (year)=>`/analytics/yearly-booking-user-chart?year=${year}`,
            transformResponse: (res: {data: any})=> res?.data,
        }),
        getOverviewStats: builder.query({
            query: ()=>`/analytics/overview-stats`,
            transformResponse: (res: {data: any})=> res?.data,
        }),
        getUserMonthlyStats: builder.query({
            query: (year)=>`/analytics/user-monthly-stats?year=${year}`,
            transformResponse: (res: {data: any})=> res?.data,
        }),
        getRevenueMonthlyStats: builder.query({
            query: (year)=>`/analytics/revenue-monthly-stats?year=${year}`,
            transformResponse: (res: {data: any})=> res?.data,
        }),
        getAgentMonthlyStats: builder.query({
            query: (year)=>`/analytics/agent-monthly-stats?year=${year}`,
            transformResponse: (res: {data: any})=> res?.data,
        })
    })
})

export const {
    useGetAnalyticsQuery,
    useGetUsersGrowthQuery,
    useGetOverViewQuery,
    useGetRevenueGrowthQuery,
    useGetBookingUsersGrowthQuery,
    useGetActiveListingsQuery,
    useGetOverviewStatsQuery,
    useGetUserMonthlyStatsQuery,
    useGetRevenueMonthlyStatsQuery,
    useGetAgentMonthlyStatsQuery
} = dashboardApi;