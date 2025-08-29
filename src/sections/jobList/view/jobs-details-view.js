import { useState, useCallback, useEffect } from 'react';
// @mui
import Container from '@mui/material/Container';
// routes
import { useParams } from 'src/routes/hook';
import { useSettingsContext } from 'src/components/settings';
// api
import { useGetJob } from 'src/api/jobs';
import JobsDetailsContent from '../jobs-details-content';

export default function JobsDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();
  const { job, isLoading } = useGetJob(id);

  const [currentTab, setCurrentTab] = useState('id'); // default active tab
  const [publish, setPublish] = useState('');

  useEffect(() => {
    if (job) setPublish(job.publish || '');
  }, [job]);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  if (isLoading) return <Container>Loading...</Container>;


  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {currentTab === 'id' && <JobsDetailsContent job={job} />}
    </Container>
  );
}
