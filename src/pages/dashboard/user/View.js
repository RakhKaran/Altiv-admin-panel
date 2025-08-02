import { Helmet } from 'react-helmet-async';
import { EventsListsView } from 'src/sections/events/view';


// sections


// ----------------------------------------------------------------------

export default function UserEventPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User View</title>
      </Helmet>

      <EventsListsView />
    </>
  );
}