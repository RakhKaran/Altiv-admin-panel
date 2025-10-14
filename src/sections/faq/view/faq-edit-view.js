// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// utils
import { useParams } from 'src/routes/hook';
// api
import { useGetFaq } from 'src/api/faq';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FaqNewEditForm from '../faq-new-edit-form';



//


// ----------------------------------------------------------------------

export default function FaqEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const {faq:currentFaqcategory}= useGetFaq(id);

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
            name: 'Faq',
            href: paths.dashboard.faq.root,
          },
          {
            name: currentFaqcategory?.name,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <FaqNewEditForm currentFaq={currentFaqcategory} />
    </Container>
  );
}
