import { Category } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { CategoryCreateView } from 'src/sections/category/view';


// ----------------------------------------------------------------------

export default function CategoryNewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Category New</title>
      </Helmet>
          <CategoryCreateView />
    </>
  );
}
