import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetCurrencyExchangeRates() {
    const URL = endpoints.currencyExchangeRates.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const useRefreshCurrencyExchangeRates = () => {
        mutate(URL);
    };

    const memoizedValue = useMemo(
        () => ({
            currencyExchangeRates: data || [],
            currencyExchangeRatesLoading: isLoading,
            currencyExchangeRatesError: error,
            currencyExchangeRatesValidating: isValidating,
            currencyExchangeRatesEmpty: !isLoading && (!data || data.length === 0),
        }),
        [data, error, isLoading, isValidating]
    );

    return {...memoizedValue, useRefreshCurrencyExchangeRates};
}