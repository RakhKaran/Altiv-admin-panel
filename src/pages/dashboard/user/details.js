import { Helmet } from 'react-helmet-async';
// sections
import { TourDetailsView } from 'src/sections/tour/view';

// ----------------------------------------------------------------------

export default function UserResumeDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User Resumes</title>
      </Helmet>

      <TourDetailsView />
    </>
  );
}
