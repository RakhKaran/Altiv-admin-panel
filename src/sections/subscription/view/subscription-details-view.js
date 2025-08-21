import { addYears, format } from 'date-fns';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetSubscription } from 'src/api/subscriptions';
import SubscriptionDetails from '../subscription-details';

// ----------------------------------------------------------------------

export default function SubscriptionDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const { subscription } = useGetSubscription(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={subscription?.createdAt
          ? `# INV-${format(new Date(subscription?.createdAt), 'yy')}-${format(addYears(new Date(subscription?.createdAt), 1), 'yy')}/${String(subscription?.id)}`
          : `${String(subscription?.id)}`}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Invoices', href: paths.dashboard.subscription.root },
          {
            name: subscription?.createdAt
              ? `# INV-${format(new Date(subscription?.createdAt), 'yy')}-${format(addYears(new Date(subscription?.createdAt), 1), 'yy')}/${String(subscription?.id)}`
              : `${String(subscription?.id)}`
          },
        ]}
      sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SubscriptionDetails subscription={subscription} />
    </Container>
  );
}
