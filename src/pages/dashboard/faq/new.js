import { Category } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { FaqCreateView } from 'src/sections/faq/view';


// ----------------------------------------------------------------------

export default function FaqNewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Faq New</title>
      </Helmet>
          <FaqCreateView />
    </>
  );
}
