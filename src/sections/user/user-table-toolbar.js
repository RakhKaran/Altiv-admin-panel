import PropTypes from 'prop-types';
import { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function UserTableToolbar({ filters, onFilters, roleOptions, }) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event) => onFilters('name', event.target.value),
    [onFilters]


  );

  const handleFilterRole = useCallback(
    (event) => {
      const value = event.target.value;

      if (value === '') {
        onFilters('permissions', []);
      } else {
        onFilters('permissions', [value]);
      }
    },
    [onFilters]
  );



  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" sx={{ p: 2 }}>
        <FormControl sx={{ width: { xs: '100%', md: 200 } }}>
          <InputLabel>Role</InputLabel>
          <Select
            multiple
            value={filters.permissions}
            onChange={(event) => onFilters('permissions', event.target.value)}
            input={<OutlinedInput label="Role" />}
            renderValue={(selected) => selected.length === 0 ? 'All Roles' : selected.join(', ')}
          >
            {(roleOptions || []).map((opt) => (
              <MenuItem key={opt} value={opt}>
                <Checkbox checked={filters.permissions.includes(opt)} />
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" />
                </InputAdornment>
              ),
            }}
          />
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
        <MenuItem onClick={popover.onClose}>
          <Iconify icon="solar:printer-minimalistic-bold" /> Print
        </MenuItem>
        <MenuItem onClick={popover.onClose}>
          <Iconify icon="solar:import-bold" /> Import
        </MenuItem>
        <MenuItem onClick={popover.onClose}>
          <Iconify icon="solar:export-bold" /> Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}

UserTableToolbar.propTypes = {
  filters: PropTypes.shape({
    name: PropTypes.string,
    permissions: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onFilters: PropTypes.func.isRequired,
  roleOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
};
