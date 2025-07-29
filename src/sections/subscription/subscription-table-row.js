import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import MenuItem from '@mui/material/MenuItem';
import { useBoolean } from 'src/hooks/use-boolean';
import IconButton from '@mui/material/IconButton';
// utils
import Iconify from 'src/components/iconify';
import { format } from 'date-fns';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function SubscriptionTableRow({ row, selected, onSelectRow, onViewRow }) {
  const { planData = {}, user = {}, expiryDate, paymentMethod } = row;
  const { planName, price, paymentType, courses } = planData;
  const { fullName } = user;

  
  
    const confirm = useBoolean();
  
    const popover = usePopover();

  const isExpired = expiryDate ? new Date(expiryDate) < new Date() : false;

  //  Map payment method correctly
  const paymentMethodLabel =
    {
      0: 'Stripe',
      1: 'Razorpay',
    }[paymentMethod] || '-';

  //  Detect recurring or one time
  const paymentTypeText = paymentType || '-';
  const isRecurring = paymentType?.toLowerCase().includes('recurring');
  const isOneTime = paymentType?.toLowerCase().includes('one time');

  //  Format expiry date based on plan type
  let formattedExpiry = 'N/A';
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
    <>
    <TableRow hover selected={selected}>
      <TableCell>{fullName || 'NA'}</TableCell>
      <TableCell>{courses?.courseName || 'NA'}</TableCell>
      <TableCell>{price !== undefined ? price : 'NA'}</TableCell>
      <TableCell>{paymentMethodLabel}</TableCell>
      <TableCell>{paymentTypeText}</TableCell>
      <TableCell>{formattedExpiry}</TableCell>
       <TableCell>
                <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              </TableCell>
  </TableRow>
       <CustomPopover
              open={popover.open}
              onClose={popover.onClose}
              arrow="right-top"
              sx={{ width: 160 }}
            >
              <MenuItem
                onClick={() => {
                  onViewRow();
                  popover.onClose();
                }}
              >
                <Iconify icon="solar:eye-bold" />
                View
              </MenuItem>
      
              {/* <MenuItem
                onClick={() => {
                  onEditRow();
                  popover.onClose();
                }}
              >
                <Iconify icon="solar:pen-bold" />
                Edit
              </MenuItem>
      
              <Divider sx={{ borderStyle: 'dashed' }} />
      
              <MenuItem
                onClick={() => {
                  confirm.onTrue();
                  popover.onClose();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
                Delete
              </MenuItem> */}
            </CustomPopover>
  </>
  );
}

SubscriptionTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow:PropTypes.func,
};
