import { baseApi } from "../../base/baseAPI";

export const enquiriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEnquiryStats: build.query({
      query: () => `/enquiries/admin/stats`,
      transformResponse: (response: { data: any }) => response.data,
    }),
    getAllEnquiries: build.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        return `/enquiries/admin/all-enqueries?${queryParams.toString()}`;
      },
    }),
    getEnquiryById: build.query({
      query: (id: string) => `/enquiries/admin/all-enqueries/${id}`,
      transformResponse: (response: { data: any }) => response.data,
    }),
  }),
});

export const { useGetEnquiryStatsQuery, useGetAllEnquiriesQuery, useGetEnquiryByIdQuery } = enquiriesApi;
