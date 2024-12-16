import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../slices/authSlice";

const baseQueryWithAuthCheck = async (args, api, extraOptions) => {
    const token = api.getState().auth.token;
    const result = await fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL,
        prepareHeaders: (headers) => {
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    })(args, api, extraOptions);

    // Check if the token has expired (assuming 405 indicates expiration)
    if (result.error && result.error.status === 405) {
        const refreshKey = result.error?.data?.error?.refreshKey;

        if (refreshKey) {
            const refreshResult = await fetchBaseQuery({
                baseUrl: import.meta.env.VITE_API_BASE_URL,
                prepareHeaders: (headers) => {
                    headers.set("Authorization", `Bearer ${token}`);
                    headers.set('x-refresh-key', refreshKey);
                    return headers;
                },
            })('/refresh-token', {
                method: 'GET',
            }).then((res) => res.data);

            if (refreshResult.data) {
                api.dispatch(setCredentials(refreshResult.data));

                const retryResult = await fetchBaseQuery({
                    baseUrl: import.meta.env.VITE_API_BASE_URL,
                    prepareHeaders: (headers) => {
                        headers.set("authorization", `Bearer ${refreshResult.data.token}`);
                        return headers;
                    },
                })(args, api, extraOptions);

                return retryResult;
            }
        }
    } else if (result.error && result.error.status === 406) {
        api.dispatch(logout());
    }

    return result;
};

export default baseQueryWithAuthCheck; 