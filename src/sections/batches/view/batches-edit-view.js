// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// utils
import { useParams } from 'src/routes/hook';
// api
import { useGetPlan } from 'src/api/plan';
import { useGetBatch } from 'src/api/batch';
import { useGetCategory } from 'src/api/category';
import { useGetPost } from 'src/api/blog';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import BatchesNewEditForm from '../batches-new-edit-form';



// ----------------------------------------------------------------------

export default function BatchesEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

 const {batch:currentBatch}= useGetBatch(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Batches',
            href: paths.dashboard.batches.root,
          },
          {
            name: currentBatch?.plan?.courses?.courseName,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BatchesNewEditForm currentBatches={currentBatch} />
    </Container>
  );
}
