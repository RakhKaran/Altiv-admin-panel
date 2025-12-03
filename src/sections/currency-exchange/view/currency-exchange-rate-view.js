// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useGetCurrencyExchangeRates } from 'src/api/currencyExchange';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//

import CurrentCurrencyExchangeRateForm from '../currency-exchange-rate-form';


// ----------------------------------------------------------------------

export default function CurrencyExchangeRateView() {
  const settings = useSettingsContext();

  const { currencyExchangeRates: currentCurrencyExchangeRate, currencyExchangeRatesLoading } = useGetCurrencyExchangeRates();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Currency Exchange"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'currency Exchange', href: paths.dashboard.currencyExchange.root},
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {!currencyExchangeRatesLoading && <CurrentCurrencyExchangeRateForm currentCurrencyExchangeRate={currentCurrencyExchangeRate} />}
    </Container>
  );
}
