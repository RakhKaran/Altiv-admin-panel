import { Helmet } from 'react-helmet-async';

import { ProfileAnalyticsListView } from 'src/sections/profile-analytics/view';


// ----------------------------------------------------------------------

export default function ProfileAnalyticsListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Profile Analytics List</title>
      </Helmet>
        <ProfileAnalyticsListView />
    </>
  );
}
