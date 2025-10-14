// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// utils
import { useParams } from 'src/routes/hook';
// api
import { useGetFaqCategory } from 'src/api/faqCategory';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FaqCategoryNewEditForm from '../faqCategory-new-edit-form';


//


// ----------------------------------------------------------------------

export default function FaqCategoryEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const {faqCategory:currentcategory}=useGetFaqCategory(id);

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
            name: currentcategory?.categoryName,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FaqCategoryNewEditForm currentFaqCategory={currentcategory} />
    </Container>
  );
}
