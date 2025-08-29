import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';

import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import { Tooltip } from '@mui/material';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { format } from 'date-fns';


// ----------------------------------------------------------------------

export default function JobTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const {id, jobTitle,experience, company,salaryRange, jobType, skillRequirements, description, location,createdAt,postedAt } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* Checkbox */}
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        {/* Company Name & Email */}
        <TableCell  sx={{ whiteSpace: 'nowrap' }}>
          {jobTitle || 'N/A'}
        </TableCell>

        {/* Address */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{company || 'N/A'}</TableCell>

        {/* Phone Number */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{location || 'N/A'}</TableCell>

        {/* Email */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{salaryRange || 'N/A'}</TableCell>

        {/* Role */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{jobType || 'N/A'}</TableCell>

         <TableCell sx={{ whiteSpace: 'nowrap' }}>{experience || 'N/A'}</TableCell>

         {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>
  <Label color={isSynced === 1 ? 'success' : 'warning'}>
    {isSynced === 1 ? 'Sync' : 'Not Sync'}
  </Label>
</TableCell> */}


  <TableCell>
        <ListItemText
          primary={format(new Date(createdAt), 'dd/MMM/yyyy')}
          secondary={format(new Date(createdAt), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

        {/* Created At */}
        <TableCell>
              <ListItemText
                primary={format(new Date(postedAt), 'dd/MMM/yyyy')}
                secondary={format(new Date(postedAt), 'p')}
                primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                secondaryTypographyProps={{
                  mt: 0.5,
                  component: 'span',
                  typography: 'caption',
                }}
              />
            </TableCell>

        {/* Actions */}
         <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="View Job">
            <IconButton onClick={onViewRow}>
              <Iconify icon="carbon:view-filled" />
            </IconButton>
         </Tooltip>
          {/* <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <ToolTip>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </TableCell> 
      </TableRow>

      {/* Popover */}
      {/* <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover> */}

      {/* Confirm Delete Dialog */}
      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure you want to delete ${companyName || ''}?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            View
          </Button>
        }
      /> */}
    </>
  );
}

JobTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
