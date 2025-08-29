import { useState } from 'react'; // ✅ Add this line
import PropTypes from 'prop-types';
// @mui
import {
  Button, Avatar, Tooltip, MenuItem, TableRow, TableCell,
  IconButton, ListItemText, Checkbox
} from '@mui/material';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { format } from 'date-fns';
import UserViewResume from './view/view-resume';

export default function UserTableRow({ row, selected, onViewRow, onViewResumeRow, onSelectRow, onDeleteRow, onEditRow, quickEdit, handleQuickEditRow, userId }) {
  const { fullName, avatar, email, phoneNumber, permissions, createdAt, isActive } = row;

  const confirm = useBoolean();
  const popover = usePopover();
  const [openResume, setOpenResume] = useState(false);


  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}



        <TableCell onClick={() => onEditRow()} sx={{ cursor: 'pointer', "&:hover": { textDecoration: 'underline' } }}>
          {fullName}
          <br />
          <ListItemText secondary={email} />
        </TableCell>

        <TableCell>{email}</TableCell>
        <TableCell>{phoneNumber}</TableCell>

        <TableCell>{permissions}</TableCell>

        <TableCell>{createdAt ? format(new Date(createdAt), 'dd/MM/yyyy') : 'N/A'}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={Number(isActive) === 1 ? 'success' : 'error'}
          >
            {Number(isActive) === 1 ? 'Active' : 'Inactive'}
          </Label>

        </TableCell>
        <TableCell>
          <Tooltip title="View Events">
            <IconButton onClick={onViewRow}>
              <Iconify icon="carbon:view-filled" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Quick Edit" placement="side" arrow>
            <IconButton onClick={handleQuickEditRow}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Resume">
            <IconButton onClick={onViewResumeRow}>
              <Iconify icon="mdi:file-document-outline" />
            </IconButton>
          </Tooltip>
        </TableCell>

        {/* <TableCell align="right">
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      {/* Popover Menu */}
      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 100 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem> */}

      {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}
      {/* </CustomPopover> */}

      {/* Delete Confirmation Dialog */}
      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete User"
        content="Are you sure you want to delete this user?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }


      /> */}
    </>
  );
}

UserTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  handleQuickEditRow: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func.isRequired,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  quickEdit: PropTypes.func,
  userId: PropTypes.string,
  onViewResumeRow: PropTypes.func,
};
