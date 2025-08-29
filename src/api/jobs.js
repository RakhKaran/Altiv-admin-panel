import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetJobs() {
    const URL = endpoints.jobs.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            jobs: data || [],
            jobsLoading: isLoading,
            jobsError: error,
            jobsValidating: isValidating,
            jobsEmpty: !isLoading && (!data || data.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetFilteredJobs(filterString) {
    const URL = filterString ? endpoints.jobs.filterList(filterString) : endpoints.post.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            Jobs: data?.data || [],
            count: data?.count || 0,
            JobsLoading: isLoading,
            JobsError: error,
            JobsValidating: isValidating,
            JobsEmpty: !isLoading && (!data || data?.blogs?.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ------------------------------------------------------------------------

export function useGetJob(id) {
    const URL = id ? endpoints.jobs.details(id) : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            job: data?.data || null,
            jobLoading: isLoading,
            jobError: error,
            jobValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

// export function useGetLatestPosts(title) {
//   const URL = title ? [endpoints.post.latest, { params: { title } }] : null;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       latestPosts: data?.latestPosts || [],
//       latestPostsLoading: isLoading,
//       latestPostsError: error,
//       latestPostsValidating: isValidating,
//       latestPostsEmpty: !isLoading && !data?.latestPosts?.length,
//     }),
//     [data?.latestPosts, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

// // ----------------------------------------------------------------------

// export function useSearchPosts(query) {
//   const URL = query ? [endpoints.post.search, { params: { query } }] : null;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
//     keepPreviousData: true,
//   });

//   const memoizedValue = useMemo(
//     () => ({
//       searchResults: data?.results || [],
//       searchLoading: isLoading,
//       searchError: error,
//       searchValidating: isValidating,
//       searchEmpty: !isLoading && !data?.results?.length,
//     }),
//     [data?.results, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }
