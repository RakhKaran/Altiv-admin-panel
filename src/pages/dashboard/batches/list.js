import { Helmet } from 'react-helmet-async';
import { BatchesListView } from 'src/sections/batches/view';


// ----------------------------------------------------------------------

export default function BatchesListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Batches List</title>
      </Helmet>
        <BatchesListView />
    </>
  );
}
