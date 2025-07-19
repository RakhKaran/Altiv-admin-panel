import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
// utils
import { format } from 'date-fns';

// ----------------------------------------------------------------------

export default function SubscriptionTableRow({
  row,
  selected,
  onSelectRow,
}) {
  const { planData = {}, user = {}, expiryDate, paymentMethod } = row;
  const { planName, price, paymentType } = planData;
  const { fullName } = user;

  const isExpired = expiryDate ? new Date(expiryDate) < new Date() : false;

  // ✅ Map payment method correctly
  const paymentMethodLabel = {
    0: 'Stripe',
    1: 'Razorpay'
  }[paymentMethod] || '-';

  // ✅ Detect recurring or one time
  const paymentTypeText = paymentType || '-';
  const isRecurring = paymentType?.toLowerCase().includes('recurring');
  const isOneTime = paymentType?.toLowerCase().includes('one time');

  // ✅ Format expiry date based on plan type
  let formattedExpiry = '—';
  if (isRecurring && expiryDate) {
    const formattedDate = format(new Date(expiryDate), 'dd MMM yyyy');
    formattedExpiry = (
      <span style={{ color: isExpired ? 'red' : 'green', fontWeight: 500 }}>
        {isExpired ? 'Expired - ' : ''}
        {formattedDate}
      </span>
    );
  } else if (isOneTime) {
    formattedExpiry = 'N/A';
  }

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>{fullName || '-'}</TableCell>
      <TableCell>{planName || '-'}</TableCell>
      <TableCell>{price !== undefined ? price : '-'}</TableCell>
      <TableCell>{paymentMethodLabel}</TableCell>
      <TableCell>{paymentTypeText}</TableCell> 
      <TableCell>{formattedExpiry}</TableCell>
    </TableRow>
  );
}

SubscriptionTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
