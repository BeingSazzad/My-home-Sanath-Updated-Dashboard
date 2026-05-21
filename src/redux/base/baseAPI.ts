import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,       
  prepareHeaders: (headers) => {      
    const token = Cookies.get("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    Cookies.remove("accessToken");
    Cookies.remove("role");
    window.location.replace("/login");
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithInterceptor,
  endpoints: () => ({}),
  tagTypes: ["user", "notifications", "admin", "category", "slider", "faqs", "withdrawal", "planner", "cars", "host", "booking", "profile", "rules", "commission", "listings"],
});

export const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;
