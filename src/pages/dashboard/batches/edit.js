import { Helmet } from 'react-helmet-async';
import { BatchesEditView } from 'src/sections/batches/view';


// ----------------------------------------------------------------------

export default function BatchesEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Batches Edit</title>
      </Helmet>
    <BatchesEditView/>
    </>
  );
}
