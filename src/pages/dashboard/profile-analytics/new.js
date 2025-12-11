import { Category } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { BatchesCreateView } from 'src/sections/batches/view';



// ----------------------------------------------------------------------

export default function BatchesNewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Batches New</title>
      </Helmet>
          <BatchesCreateView />
    </>
  );
}
