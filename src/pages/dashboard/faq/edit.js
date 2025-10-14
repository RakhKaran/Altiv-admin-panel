import { Helmet } from 'react-helmet-async';
import { FaqEditView } from 'src/sections/faq/view';


// ----------------------------------------------------------------------

export default function FaqEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Fq Edit</title>
      </Helmet>
    <FaqEditView/>
    </>
  );
}
