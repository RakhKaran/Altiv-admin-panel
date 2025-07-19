import { Helmet } from 'react-helmet-async';
// sections

// import { EmailListView } from 'src/sections/email/view';
import { ContactListView } from 'src/sections/contactus/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Email List</title>
      </Helmet>

      <ContactListView />
    </>
  );
}
