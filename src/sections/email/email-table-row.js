import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
// utils
import { format } from 'date-fns';

// ----------------------------------------------------------------------

export default function EmailTableRow({
  row,
  selected,
  onSelectRow,
}) {
  const { email} = row;


  
  
 
  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>{email || '-'}</TableCell>
    </TableRow>
  );
}

EmailTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
