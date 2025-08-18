import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// utils
import { format } from 'date-fns';

// ----------------------------------------------------------------------

export default function EventsTableRow({ row, selected, onSelectRow }) {

  
  const { eventName, eventDescription,screenName, user={},createdAt } = row;
  const {fullName}=user

  return (
    <TableRow hover selected={selected}>
      <TableCell>{eventName || 'NA'}</TableCell>
      <TableCell>{eventDescription || 'NA'}</TableCell>
      <TableCell>{screenName || 'NA'}</TableCell>
      <TableCell>{fullName || 'NA'}</TableCell>

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

EventsTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
