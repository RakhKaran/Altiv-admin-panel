import PropTypes from 'prop-types';
// @mui
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';

// ----------------------------------------------------------------------

export default function JobsDetailsContent({ job }) {
  if (!job) return null;

  const {
    jobTitle,
    experience,
    company,
    salaryRange,
    jobType,
    skillRequirements,
    description,
    location,
    createdAt,
    postedAt,
  } = job;

  // ---------------- Render Content ----------------
  const renderContent = (
    <Stack component={Card} spacing={3} sx={{ p: 3 }}>
      <Typography variant="h4">{jobTitle || 'N/A'}</Typography>

      {description ? <Markdown>{description}</Markdown> : <Typography>No description available</Typography>}

      {Array.isArray(skillRequirements) && skillRequirements.length > 0 && (
        <Stack spacing={2}>
          <Typography variant="h6">Skills</Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {skillRequirements.map((skill, index) => (
              <Chip key={index} label={skill} variant="soft" />
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );

  // ---------------- Render Overview ----------------
  const renderOverview = (
    <Stack component={Card} spacing={2} sx={{ p: 3 }}>
      {[
        {
          label: 'Date Created',
          value: createdAt ? fDate(createdAt) : 'N/A',
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Posted Date',
          value: postedAt ? fDate(postedAt) : 'N/A',
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Job Type',
          value: jobType || 'N/A',
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          label: 'Salary Range',
          value: salaryRange || 'N/A',
          icon: <Iconify icon="solar:wad-of-money-bold" />,
        },
        {
          label: 'Experience',
          value: experience || 'N/A',
          icon: <Iconify icon="carbon:skill-level-basic" />,
        },
        {
          label: 'Location',
          value: location || 'N/A',
          icon: <Iconify icon="mdi:map-marker" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row" alignItems="center">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{
              typography: 'body2',
              color: 'text.secondary',
              mb: 0.5,
            }}
            secondaryTypographyProps={{
              typography: 'subtitle2',
              color: 'text.primary',
              component: 'span',
            }}
          />
        </Stack>
      ))}
    </Stack>
  );

  // ---------------- Render Company ----------------
  const renderCompany = (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={2}
      direction="row"
      sx={{ p: 3, borderRadius: 2, mt: 3 }}
    >
      <Avatar
        alt={company || 'Company'}
        // src={company?.logo || ''}
        variant="rounded"
        sx={{ width: 64, height: 64 }}
      />

      {company && (
        <Stack spacing={1}>
          <Typography variant="subtitle1">{company}</Typography>
          {job.fullAddress && <Typography variant="body2">{job.fullAddress}</Typography>}
          {job.phoneNumber && <Typography variant="body2">{job.phoneNumber}</Typography>}
        </Stack>
      )}
    </Stack>
  );

  // ---------------- Final Layout ----------------
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        {renderContent}
      </Grid>

      <Grid xs={12} md={4}>
        {renderOverview}
        {renderCompany}
      </Grid>
    </Grid>
  );
}

JobsDetailsContent.propTypes = {
  job: PropTypes.object,
};
