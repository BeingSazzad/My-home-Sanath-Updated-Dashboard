import { baseApi } from "../../base/baseAPI";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query({
      query: () => `/users/${location.search}`,
      providesTags: ['user'],
    }),

    updateUser: build.mutation({
      query: (data) => {
        return {
          url: `/users/status/${data?.id}`,
          method: "PATCH",
          body: data
        }
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
    })
  }),
});

export const {
  useGetUsersQuery,
  useGetAdminQuery,
  useGetAdminStatsQuery,
  useGetProfileQuery,
  useGetAllSubscriberQuery,

  useDeleteAdminMutation,
  useGetSingleUserQuery,
  useDeleteUserMutation,
  useEditProfileMutation,
  useCreateAdminMutation,
  useUpdateUserMutation,
} = userApi;
