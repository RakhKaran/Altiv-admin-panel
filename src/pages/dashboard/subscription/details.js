import { Helmet } from 'react-helmet-async';
// sections
import { SubscriptionDetailsView } from 'src/sections/subscription/view';

// ----------------------------------------------------------------------

export default function SubscriptionDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Subscription Details</title>
      </Helmet>

      <SubscriptionDetailsView />
    </>
  );
}
