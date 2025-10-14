import { Helmet } from 'react-helmet-async';
import { FaqCategoryEditView } from 'src/sections/faqCategory/view';


// ----------------------------------------------------------------------

export default function FaqCategoryEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Category Edit</title>
      </Helmet>
    <FaqCategoryEditView/>
    </>
  );
}
