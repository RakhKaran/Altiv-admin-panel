// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// utils
import { useParams } from 'src/routes/hook';
// api
import { useGetCategory } from 'src/api/category';
import { useGetPost } from 'src/api/blog';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CategoryNewEditForm from '../category-new-edit-form';

//


// ----------------------------------------------------------------------

export default function CategoryEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { category: currentcategory } = useGetCategory(id);

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
            name: 'Category',
            href: paths.dashboard.category.root,
          },
          {
            name: currentcategory?.name,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CategoryNewEditForm currentCategory={currentcategory} />
    </Container>
  );
}
