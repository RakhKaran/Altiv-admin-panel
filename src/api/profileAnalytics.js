import useSWR from 'swr';
import { useCallback, useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetProfiles() {
  const URL = endpoints.profileAnalytics.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const refreshProfiles = useCallback(() => {
    mutate(); // 🔥 this triggers refetch correctly
  }, [mutate]);

  return {
    profiles: data?.analyticsList || [],
    profilesLoading: isLoading,
    profilesError: error,
    profilesValidating: isValidating,
    profilesEmpty: !isLoading && (!data?.analyticsList || data.analyticsList.length === 0),
    refreshProfiles,
  };
}
// ----------------------------------------------------------------------

export function useGetPlan(id) {
  const URL = id ? endpoints.plan.details(id) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      plan: data,
      planLoading: isLoading,
      planError: error,
      planValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useFilterPlans(queryString) {
  const URL = queryString ? endpoints.plan.filterList(queryString) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });


  const memoizedValue = useMemo(
    () => ({
      filteredPlans: data || [],
      filterLoading: isLoading,
      filterError: error,
      filterValidating: isValidating,
      filterEmpty: !isLoading && (!data || data.length === 0),
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
