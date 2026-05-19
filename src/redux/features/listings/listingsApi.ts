import { baseApi } from "../../base/baseAPI";

export const listingsApi = baseApi.enhanceEndpoints({addTagTypes: ['Listings']}).injectEndpoints({
  endpoints: (build) => ({
    getAllListings: build.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.listingType) queryParams.append("listingType", params.listingType);
        
        return `/listings/admin/all?${queryParams.toString()}`;
      },
      providesTags: ['Listings'],
    }),
    changeListingStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/listings/admin/change-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ['Listings'],
    }),
    getListingById: build.query({
      query: (id: string) => `/listings/admin/${id}`,
      providesTags: ['Listings'],
    }),
  }),
});

export const { useGetAllListingsQuery, useChangeListingStatusMutation, useGetListingByIdQuery } = listingsApi;
