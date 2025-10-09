// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//

import BatchesNewEditForm from '../batches-new-edit-form';

// ----------------------------------------------------------------------

export default function BatchesCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Batch"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Batches',
            href: paths.dashboard.batches.root,
          },
          { name: 'New Batch' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BatchesNewEditForm/>
    </Container>
  );
}
