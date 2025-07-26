import { Helmet } from 'react-helmet-async';
// sections
import { PlanCreateView } from 'src/sections/plan/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new plan</title>
      </Helmet>

      <PlanCreateView />
    </>
  );
}
