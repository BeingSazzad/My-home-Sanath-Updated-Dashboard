import { baseApi } from "../base/baseAPI";

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTransactions: build.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        if (params?.status) queryParams.append("status", params.status);
        
        return `/transactions?${queryParams.toString()}`;
      },
    }),
  }),
});

export const { useGetTransactionsQuery } = transactionApi;
