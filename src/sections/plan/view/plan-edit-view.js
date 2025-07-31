// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useGetPlan } from 'src/api/plan'; 
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PlanNewEditForm from '../plan-new-edit-form';


// ----------------------------------------------------------------------

export default function PlanEditView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const { plan: currentPlan, planLoading } = useGetPlan(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Plan', href: (currentPlan && currentPlan?.planGroup === 0) ? paths.dashboard.plan.courseList : paths.dashboard.plan.serviceList},
          { name: currentPlan?.planName || '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {!planLoading && <PlanNewEditForm currentPlan={currentPlan} />}
    </Container>
  );
}
