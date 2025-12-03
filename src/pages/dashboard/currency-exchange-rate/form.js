import { Helmet } from 'react-helmet-async';
// sections
import { CurrencyExchangeRateView } from 'src/sections/currency-exchange/view';

// ----------------------------------------------------------------------

export default function CurrencyExchangeRateFormPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Currency Exchange</title>
      </Helmet>

      <CurrencyExchangeRateView />
    </>
  );
}
