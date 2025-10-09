import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// utils
import { format } from 'date-fns';
import { IconButton, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';


// ----------------------------------------------------------------------

export default function BatchTableRow({ row, selected, onSelectRow, onViewRow, onEditRow }) {
  const { plan, startDate, endDate, isActive } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell>{plan.courses.courseName || 'NA'}</TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(startDate), 'dd/MMM/yyyy')}
          secondary={format(new Date(startDate), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(endDate), 'dd/MMM/yyyy')}
          secondary={format(new Date(endDate), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={Number(isActive) === 1 ? 'success' : 'error'}
        >
          {Number(isActive) === 1 ? 'Active' : 'Inactive'}
        </Label>

      </TableCell>

      <TableCell>
        <Tooltip title="Edit" placement="top" arrow>
          <IconButton onClick={onEditRow}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

BatchTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
};
