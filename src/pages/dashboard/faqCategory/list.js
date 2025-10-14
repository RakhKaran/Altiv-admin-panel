import { Helmet } from 'react-helmet-async';
import { FaqCategoryListView } from 'src/sections/faqCategory/view';


// ----------------------------------------------------------------------

export default function FaqCategoryListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Category List</title>
      </Helmet>
        <FaqCategoryListView/>
    </>
  );
}
