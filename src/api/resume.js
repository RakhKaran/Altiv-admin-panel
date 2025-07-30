import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetResumesByUserId(userId) {
  const URL = userId ? endpoints.resume.details(userId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  
  const memoizedValue = useMemo(
    () => ({
      resume: data,
      resumeLoading: isLoading,
      resumeError: error,
      resumeValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------



