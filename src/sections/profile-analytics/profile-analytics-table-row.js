import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { IconButton, Tooltip, Typography, Popover, Box, Chip } from '@mui/material';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import axiosInstance from 'src/utils/axios';
import { enqueueSnackbar } from 'notistack';
import { color } from 'framer-motion';
import { useGetProfiles } from 'src/api/profileAnalytics';
import { format } from 'date-fns';

// ----------------------------------------------------------------------
const STATUS_UI_MAP = {
  0: { label: 'Created', color: 'default' },
  1: { label: 'Processing', color: 'warning' },
  2: { label: 'Success', color: 'success' },
  3: { label: 'Rejected', color: 'error' },
};


export default function ProfileAnalyticsTableRow({ row, selected, onSelectRow, onViewRow, onEditRow, refreshProfiles }) {
  const { trialCount, createdAt, resume, error, isActive, status } = row;

  const statusInfo = STATUS_UI_MAP[status];



  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    if (status === 3) setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleRetry = async () => {
    try {
      const response = await axiosInstance.post(
        `running-analytics/retry/${row.id}`
      );

      enqueueSnackbar(response.data.message, { variant: 'success' });


      refreshProfiles();

    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || 'Retry failed', {
        variant: 'error',
      });
    }
  };



  return (
    <>
      <TableRow hover selected={selected}>

        <TableCell>
          {resume?.user?.fullName || 'Guest User'}
          <br />
          <ListItemText secondary={resume?.user?.email || 'NA'} />
        </TableCell>

        <TableCell>{trialCount}</TableCell>

        <TableCell>
          {resume?.fileDetails?.fileUrl ? (
            <Typography
              onClick={() => window.open(resume.fileDetails.fileUrl, '_blank')}
              sx={{
                fontSize: '0.875rem',
                cursor: 'pointer',
                color: '#1976d2',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              View
            </Typography>
          ) : (
            'NA'
          )}
        </TableCell>
        <TableCell>
          <ListItemText
            primary={format(new Date(createdAt), 'dd MMM yyyy')}
            secondary={format(new Date(createdAt), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        {/* STATUS CELL */}
        <TableCell
          onClick={status === 3 ? handleOpen : undefined}
          sx={{ cursor: status === 3 ? 'pointer' : 'default' }}
        >
          {statusInfo ? (
            <Label
              variant="soft"
              color={statusInfo.color}
              sx={{
                textTransform: 'capitalize',
                '&:hover': status === 3 ? { textDecoration: 'underline' } : null,
              }}
            >
              {statusInfo.label}
            </Label>
          ) : (
            'NA'
          )}
        </TableCell>


        {/* RETRY ICON */}
        <TableCell>
          <Tooltip title={status === 3 ? "Retry" : "Retry not available"} arrow>
            <IconButton
              onClick={status === 3 ? handleRetry : undefined}
              disabled={status !== 3}
              sx={{
                '&.Mui-disabled svg': { color: '#bdbdbd' },
              }}
            >
              <Iconify
                icon="solar:refresh-bold"
                width={20}
                style={{ color: status === 3 ? '#1976d2' : '#bdbdbd' }}
              />
            </IconButton>
          </Tooltip>
        </TableCell>


      </TableRow>

      {/* POPUP FOR ERROR */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: 250 }}>
          <Typography variant="subtitle2" sx={{ color: '#d32f2f', fontWeight: 700 }}>
            Rejection Reason:
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {error || 'No error message provided'}
          </Typography>
        </Box>
      </Popover>
    </>
  );
}

ProfileAnalyticsTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  refreshProfiles: PropTypes.func
};
