import { Helmet } from 'react-helmet-async';
// sections

import { PlanListView } from 'src/sections/plan/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Plans List</title>
      </Helmet>

      <PlanListView />
    </>
  );
}
