import { Helmet } from 'react-helmet-async';
// sections
import UserViewEvent from 'src/sections/user/view/user-view-event';

// ----------------------------------------------------------------------

export default function UserEventPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User View</title>
      </Helmet>

      <UserViewEvent />
    </>
  );
}