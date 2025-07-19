import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetEmails() {
  const URL = endpoints.email.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      emails: data || [],
      emailsLoading: isLoading,
      emailsError: error,
      emailsValidating: isValidating,
      emailsEmpty: !isLoading && (!data || data.length === 0),
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetEmail(id) {
  const URL = id ? endpoints.email.details(id) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      email: data,
      emailLoading: isLoading,
      emailError: error,
      emailValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useFilteremails(queryString) {
  const URL = queryString ? endpoints.email.filterList(queryString) : null;

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
