import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetCounts() {
    const URL = endpoints.dashboard.count;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            data: data || null,
            dataLoading: isLoading,
            dataError: error,
            dataValidating: isValidating,
            dataEmpty: !isLoading && !data,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

// export function useGetEmail(id) {
//   const URL = id ? endpoints.email.details(id) : null;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       email: data,
//       emailLoading: isLoading,
//       emailError: error,
//       emailValidating: isValidating,
//     }),
//     [data, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

// // ----------------------------------------------------------------------

// export function useFilteremails(queryString) {
//   const URL = queryString ? endpoints.email.filterList(queryString) : null;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
//     keepPreviousData: true,
//   });

//   const memoizedValue = useMemo(
//     () => ({
//       filteredPlans: data || [],
//       filterLoading: isLoading,
//       filterError: error,
//       filterValidating: isValidating,
//       filterEmpty: !isLoading && (!data || data.length === 0),
//     }),
//     [data, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }
