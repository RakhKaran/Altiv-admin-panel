// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import FaqCategoryNewEditForm from '../faqCategory-new-edit-form';

// ----------------------------------------------------------------------

export default function FaqCategoryCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new faq category"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Category',
            href: paths.dashboard.faqCategory.root,
          },
          { name: 'New faq category' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FaqCategoryNewEditForm/>
    </Container>
  );
}
