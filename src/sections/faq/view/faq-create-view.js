// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import FaqNewEditForm from '../faq-new-edit-form';

// ----------------------------------------------------------------------

export default function FaqCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new faq"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Faq',
            href: paths.dashboard.faq.root,
          },
          { name: 'New faq' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FaqNewEditForm/>
    </Container>
  );
}
