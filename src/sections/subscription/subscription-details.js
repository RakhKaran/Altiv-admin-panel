import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
// utils
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
// _mock
import { INVOICE_STATUS_OPTIONS } from 'src/_mock';
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
//
// import InvoiceToolbar from './invoice-toolbar';
 import SubscriptionToolbar from './subscription-toolbar';

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export default function SubscriptionDetails({ subscription }) {
  // const [currentStatus, setCurrentStatus] = useState(subscription.status);

  // const handleChangeStatus = useCallback((event) => {
  //   setCurrentStatus(event.target.value);
  // }, []);

  const renderTotal = (
    <>
      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>
          <Box sx={{ mt: 2 }} />
          Subtotal
        </TableCell>
        <TableCell width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {`₹${subscription?.planData?.price}`}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ typography: 'subtitle1' }}>Total</TableCell>
        <TableCell width={140} sx={{ typography: 'subtitle1' }}>
          {`₹${subscription?.planData?.price}`}
        </TableCell>
      </StyledTableRow>
    </>
  );

  const renderFooter = (
     <Grid container>
      <Grid xs={12} md={9} sx={{ py: 3 }}>
        <Typography variant="subtitle2">NOTES</Typography>

        <Typography variant="body2">
          Electronically generated invoice – valid without signature.!
        </Typography>
      </Grid>

      <Grid xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
        <Typography variant="subtitle2">Have a Question?</Typography>

        <Typography variant="body2">support@altiv.ai</Typography>
      </Grid>
    </Grid>
  );

  const renderList = (
    <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
      <Scrollbar>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell width={40}>#</TableCell>

              <TableCell sx={{ typography: 'subtitle2' }}>Description</TableCell>

              <TableCell>Qty</TableCell>

              <TableCell align="right">Unit price</TableCell>

              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
              <TableRow>
                <TableCell>{1}</TableCell>

                <TableCell>
                  <Box sx={{ maxWidth: 560 }}>
                    <Typography variant="subtitle2">{subscription?.planData?.courses?.courseName}</Typography>

                    {/* <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {row.description}
                    </Typography> */}
                  </Box>
                </TableCell>

                <TableCell>{1}</TableCell>

                <TableCell align="right">{`₹${subscription?.planData?.price}`}</TableCell>

                <TableCell align="right">{`₹${subscription?.planData?.price}`}</TableCell>
              </TableRow>

            {renderTotal}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  return (
    <>
      <SubscriptionToolbar
        subscriptions={subscription}
        
      />

      <Card sx={{ pt: 5, px: 5 }}>
        <Box
          rowGap={5}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Box
            component="img"
            alt="logo"
            src="/logo/altiv_logo.png"
            sx={{ width: 80, height: 20 }}
          />

         <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
  <Typography variant="h6" sx={{ color: 'success.main' }}> Paid</Typography>

            <Typography variant="h6">INV-{subscription?.id}</Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Invoice From
            </Typography>
                Altive Ai
            {/* <br />
            {invoice.invoiceFrom.fullAddress} */}
            <br />
            Phone: 8767876789
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Invoice To
            </Typography>
            {subscription?.planData?.user?.fullName }
            {/* <br />
            {invoice.invoiceTo.fullAddress} */}
            <br />
            Phone: {subscription?.planData?.user?.contact }
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Date Create
            </Typography>
            {fDate(subscription?.createdAt)}
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Due Date
            </Typography>
            {
              (subscription?.paymentType === 'reccuring' &&  subscription?.expiryDate) ? fDate( subscription?.expiryDate) : 'NA'
            }
          </Stack>
        </Box>

        {renderList}

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

        {renderFooter}
      </Card>
    </>
  );
}

SubscriptionDetails.propTypes = {
  subscription: PropTypes.object,
};
