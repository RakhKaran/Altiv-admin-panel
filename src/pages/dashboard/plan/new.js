import { Helmet } from 'react-helmet-async';
// sections
import { PlanCreateView } from 'src/sections/plan/view';

// ----------------------------------------------------------------------

export default function PlanCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new product</title>
      </Helmet>

      <PlanCreateView />
    </>
  );
}
