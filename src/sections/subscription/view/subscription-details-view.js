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
        heading={`INV -${subscription?.id}`}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Subscriptions', href: paths.dashboard.subscription.root },
          { name: `INV -${subscription?.id}` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SubscriptionDetails subscription={subscription} />
    </Container>
  );
}
