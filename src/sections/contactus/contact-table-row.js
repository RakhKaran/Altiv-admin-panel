import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
// utils
import { format } from 'date-fns';
import { ListItemText } from '@mui/material';

// ----------------------------------------------------------------------

export default function ContactTableRow({ row, selected, onSelectRow }) {
  const { name, email, subject, message, createdAt } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell>{name || 'NA'}</TableCell>
      <TableCell>{email || 'NA'}</TableCell>
      <TableCell>{subject || 'NA'}</TableCell>
      <TableCell>{message || 'NA'}</TableCell>
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
    </TableRow>
  );
}

ContactTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
