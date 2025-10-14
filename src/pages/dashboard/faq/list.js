import { Helmet } from 'react-helmet-async';
import { FaqListView } from 'src/sections/faq/view';


// ----------------------------------------------------------------------

export default function FaqListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Faq List</title>
      </Helmet>
        <FaqListView />
    </>
  );
}
