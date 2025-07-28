import { Helmet } from 'react-helmet-async';

// sections
import { PlanEditView } from 'src/sections/plan/view';

// ----------------------------------------------------------------------

export default function UserEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Product Edit</title>
      </Helmet>

      <PlanEditView />
    </>
  );
}
