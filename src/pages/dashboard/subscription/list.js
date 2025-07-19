import { Helmet } from 'react-helmet-async';
// sections

import { SubscriptionListView } from 'src/sections/subscription/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Subscriptions List</title>
      </Helmet>

      <SubscriptionListView />
    </>
  );
}
