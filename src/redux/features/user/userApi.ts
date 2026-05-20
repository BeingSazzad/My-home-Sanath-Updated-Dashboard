import { baseApi } from "../../base/baseAPI";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        if (params?.role) queryParams.append("role", params.role);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.plan) queryParams.append("plan", params.plan);

        return {
          url: `/users?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['user'],
    }),

    updateUser: build.mutation({
      query: (arg: { id: string; status: string }) => {
        const id = String(arg?.id ?? "").trim();
        const normalizedStatus = String(arg?.status ?? "")
          .trim()
          .toUpperCase();

        return {
          url: `/users/status/${id}`,
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: { status: normalizedStatus },
        };
      },
      invalidatesTags: ['user', 'admin', 'host'],
    }),

    deleteUser: build.mutation({
      query: (id) => {
        return {
          url: `/users/${id}`,
          method: "DELETE"
        }
      },
      invalidatesTags: ["user"]
    }),

    getSingleUser: build.query({
      query: (id) => `/user-managements/${id}`,
      providesTags: ['user'],
      transformResponse: (response: { data: any }) => response.data,
    }),

    getProfile: build.query({
      query: () => `/users/profile`,
      providesTags: ['profile'],
      transformResponse: (response: { data: any }) => response.data,
    }),

    getUserStats: build.query({
      query: () => `/analytics/user-management-stats?role=USER`,
      providesTags: ['user'],
      transformResponse: (response: { data: any }) => response.data,
    }),

    getAgentStats: build.query({
      query: () => `/analytics/user-management-stats?role=AGENT`,
      providesTags: ['user'],
      transformResponse: (response: { data: any }) => response.data,
    }),

    editProfile: build.mutation({
      query: (data) => {
        return {
          url: '/users',
          method: "PATCH",
          body: data,
        }
      },
      invalidatesTags: ['profile'],
    }),

    // ------------ Admin -----------------
    createAdmin: build.mutation({
      query: (data) => {
        return {
          url: "/users/create-admin",
          method: "POST",
          body: data
        }
      },
      invalidatesTags: ['user', 'admin'],
    }),

    getAdmin: build.query({
      query: () => `/users/admins${location.search}`,
      providesTags: ['admin'],
      transformResponse: (response: { data: any }) => response.data,
    }),
    getAdminStats: build.query({
      query: () => `/analytics/stats`,
      providesTags: ['admin'],
      transformResponse: (response: { data: any }) => response.data,
    }),
    deleteAdmin: build.mutation({
      query: (id) => { return { url: `/users/admins/${id}`, method: "DELETE" } },
      invalidatesTags: ['admin'],

    }),




    getAllSubscriber: build.query({
      query: () => `/subscriptions${location?.search}`,
      transformResponse: (res: { data: any }) => res?.data
    }),

    userDelete: build.mutation({
      query: (id) => {
        return {
          url: `/users/${id}`,
          method: "DELETE"
        }
      },
      invalidatesTags: ["user"]
    }),
    userStatusUpdate: build.mutation({
      query: (arg: { id: string; status: string }) => {
        const id = String(arg?.id ?? "").trim();
        const normalizedStatus = String(arg?.status ?? "")
          .trim()
          .toUpperCase();

        return {
          url: `/users/status/${id}`,
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: { status: normalizedStatus },
        };
      },
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetAdminQuery,
  useGetAdminStatsQuery,
  useGetUserStatsQuery,
  useGetAgentStatsQuery,
  useGetProfileQuery,
  useGetAllSubscriberQuery,

  useDeleteAdminMutation,
  useGetSingleUserQuery,
  useDeleteUserMutation,
  useEditProfileMutation,
  useCreateAdminMutation,
  useUpdateUserMutation,
  useUserDeleteMutation,
  useUserStatusUpdateMutation,
} = userApi;
