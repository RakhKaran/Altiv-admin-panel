import { Category } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { FaqCategoryCreateView } from 'src/sections/faqCategory/view';


// ----------------------------------------------------------------------

export default function FaqCategoryNewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: FaqCategory New</title>
      </Helmet>
          <FaqCategoryCreateView />
    </>
  );
}
