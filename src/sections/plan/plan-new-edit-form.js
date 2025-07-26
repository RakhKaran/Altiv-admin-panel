import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFEditor,
  RHFSelect,
} from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';

const PAYMENT_TYPE_OPTIONS = [

  { value: 'recurring', label: 'Recurring' },
  { value: 'oneTime', label: 'One Time' },
  
];

const RECURRING_PERIOD_OPTIONS = [
  { value: 'monthly', label: 'Monthly', days: 28 },
  { value: 'yearly', label: 'Yearly', days: 365 },
  { value: 'weekly', label: 'Weekly', days: 7 },
];

const FREE_PLAN_OPTIONS = [
   { value: false, label: 'Paid' },
  { value: true, label: 'Free' },
 
];

export default function PlanNewEditForm({ currentPlan }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const PlanSchema = Yup.object().shape({
    planName: Yup.string().required('Plan name is required'),
    subTitle: Yup.string().required('Subtitle is required'),
    price: Yup.number().when('isFreePlan', {
      is: false,
      then: (schema) => schema.min(0).required('Price is required'),
      otherwise: (schema) => schema.strip(),
    }),
    paymentType: Yup.string().when('isFreePlan', {
      is: false,
      then: (schema) => schema.required('Payment type is required'),
      otherwise: (schema) => schema.strip(),
    }),
    recurringPeriod: Yup.string().when(['isFreePlan', 'paymentType'], {
      is: (isFreePlan, paymentType) => !isFreePlan && paymentType === 'recurring',
      then: (schema) => schema.required('Recurring period is required'),
      otherwise: (schema) => schema.strip(),
    }),
    features: Yup.string().required('Features are required'),
    planType: Yup.number().when(['isFreePlan', 'paymentType'], {
      is: (isFreePlan, paymentType) => !isFreePlan && paymentType === 'recurring',
      then: (schema) => schema.required('Plan type is required'),
      otherwise: (schema) => schema.strip(),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      planName: currentPlan?.planName || '',
      subTitle: currentPlan?.subTitle || '',
      price: currentPlan?.price || 0,
      paymentType: currentPlan?.paymentType ,
      recurringPeriod: currentPlan?.recurringPeriod || '',
      features: currentPlan?.features || '',
      planType: currentPlan?.planType || 0,
      isFreePlan: currentPlan?.isFreePlan ,
    }),
    [currentPlan]
  );

  const methods = useForm({
    resolver: yupResolver(PlanSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const inputData = {
        planName: data.planName,
        subTitle: data.subTitle,
        price: data.isFreePlan ? 0 : data.price,
        paymentType: data.isFreePlan ? '' : data.paymentType,
        recurringPeriod: !data.isFreePlan && data.paymentType === 'recurring' ? data.recurringPeriod : '',
        features: data.features,
        planType: !data.isFreePlan && data.paymentType === 'recurring' ? data.planType : 0,
        isFreePlan: data.isFreePlan,
      };

      if (!currentPlan) {
        await axiosInstance.post('/plans', inputData);
      } else {
        await axiosInstance.patch(`/plans/${currentPlan.id}`, inputData);
      }

      reset();
      enqueueSnackbar(currentPlan ? 'Plan updated successfully!' : 'Plan created successfully!');
      router.push(paths.dashboard.plan.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error?.message || 'Something went wrong', {
        variant: 'error',
      });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="planName" label="Plan Name" />
              <RHFTextField name="subTitle" label="Subtitle" />

              <RHFSelect name="isFreePlan" label="Plan Type">
                {FREE_PLAN_OPTIONS.map((option) => (
                  <MenuItem key={option.label} value={option.value}>{option.label}</MenuItem>
                ))}
              </RHFSelect>

              {!values.isFreePlan && (
                <>
                  <RHFTextField name="price" label="Price" type="number" />
                  <RHFSelect name="paymentType" label="Payment Type">
                    {PAYMENT_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </RHFSelect>

                  {values.paymentType === 'recurring' && (
                    <>
                      <RHFSelect name="recurringPeriod" label="Recurring Period">
                        {RECURRING_PERIOD_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                        ))}
                      </RHFSelect>

                      <RHFTextField name="planType" label="Plan Type" type="number" />
                    </>
                  )}
                </>
              )}
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Features
              </Typography>
              <RHFEditor name="features" simple />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentPlan ? 'Create Plan' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

PlanNewEditForm.propTypes = {
  currentPlan: PropTypes.object,
};
