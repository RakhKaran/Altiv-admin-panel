import { Helmet } from 'react-helmet-async';
import PlanStepper from 'src/sections/plan/stepper';
// sections
import { PlanCreateView } from 'src/sections/plan/view';

// ----------------------------------------------------------------------

export default function PlanCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new product</title>
      </Helmet>

      {/* <PlanCreateView /> */}
<PlanStepper/>
    </>
  );
}
