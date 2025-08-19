import { Helmet } from 'react-helmet-async';
import { CategoryEditView } from 'src/sections/category/view';


// ----------------------------------------------------------------------

export default function CategoryEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Category Edit</title>
      </Helmet>
    <CategoryEditView/>
    </>
  );
}
