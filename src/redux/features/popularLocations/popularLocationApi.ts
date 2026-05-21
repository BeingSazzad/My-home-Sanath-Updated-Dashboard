import { baseApi } from "../../base/baseAPI";
import type { IPublishedListingOption } from "../../../types/popularLocation.types";

const popularLocationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAvailableListings: build.query<
      IPublishedListingOption[],
      string | undefined
    >({
      query: (popularLocationId) => {
        const params = popularLocationId
          ? `?popularLocationId=${popularLocationId}`
          : "";
        return `/popular-locations/available-listings${params}`;
      },
      providesTags: ["popularLocations"],
      transformResponse: (res: { data?: unknown }) => {
        const data = res?.data ?? res;
        if (!Array.isArray(data)) return [];
        return data.map((item: IPublishedListingOption & { id?: string }) => ({
          ...item,
          _id: item._id || item.id || "",
        }));
      },
    }),
    getPopularLocations: build.query({
      query: () => `/popular-locations`,
      providesTags: ["popularLocations"],
      transformResponse: (res: { data?: unknown }) => {
        const data = res?.data ?? res;
        return Array.isArray(data) ? data : [];
      },
    }),
    createPopularLocation: build.mutation({
      query: (body: FormData | Record<string, unknown>) => ({
        url: `/popular-locations`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["popularLocations"],
    }),
    updatePopularLocation: build.mutation({
      query: ({ id, body }: { id: string; body: FormData | Record<string, unknown> }) => ({
        url: `/popular-locations/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["popularLocations"],
    }),
    deletePopularLocation: build.mutation({
      query: (id: string) => ({
        url: `/popular-locations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["popularLocations"],
    }),
  }),
});

export const {
  useGetAvailableListingsQuery,
  useGetPopularLocationsQuery,
  useCreatePopularLocationMutation,
  useUpdatePopularLocationMutation,
  useDeletePopularLocationMutation,
} = popularLocationApi;

export default popularLocationApi;
