import { baseApi } from "../../base/baseAPI";

const packagesApi = baseApi.injectEndpoints({
    endpoints: build=>({
        getPackages: build.query({
            query: ()=>`/plans`,
            transformResponse: (res: {data: any})=>res?.data
        }),
        addPackage: build.mutation({
            query: (data: any)=>({
                url: `/plans`,
                method: 'POST',
                body: data
            }),
            transformResponse: (res: {data: any})=>res?.data
        }),
        updatePackage: build.mutation({
            query: ({id, data}: {id: string, data: any})=>({
                url: `/plans/${id}`,                
                method: 'PATCH',
                body: data
            }),
            transformResponse: (res: {data: any})=>res?.data
        }),
        deletePackage: build.mutation({
            query: (id: string)=>({
                url: `/plans/${id}`,
                method: 'DELETE',
        })
        }),        
    })
})


export const {
    useGetPackagesQuery,
    useAddPackageMutation,
    useUpdatePackageMutation,
    useDeletePackageMutation
} = packagesApi;