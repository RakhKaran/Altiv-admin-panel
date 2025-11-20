import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
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
import CourseFieldsComponents from './course-fields-component';
import ServiceFieldsComponents from './service-fields-components';

const PAYMENT_TYPE_OPTIONS = [
  { value: 'recurring', label: 'Recurring' },
  { value: 'oneTime', label: 'One Time' },
];

const RECURRING_PERIOD_OPTIONS = [
  { value: 'monthly', label: 'Monthly', days: 28 },
  { value: 'yearly', label: 'Yearly', days: 365 },
  { value: 'weekly', label: 'Weekly', days: 7 },
];

const planGroupOption = [
  { value: '0', label: 'Course' },
  { value: '1', label: 'Service' }
];

const planType = [
  { value: '0', label: 'Data Science' },
  { value: '1', label: 'Marketing' },
  { value: '2', label: 'Product Management' },
];

const FREE_PLAN_OPTIONS = [
  { value: false, label: 'Paid' },
  { value: true, label: 'Free' },
];
const format = [
  { value: 'Live ', label: 'Live ' },
  { value: 'Self-paced', label: 'Self-paced' },

];

const pages = [

  { value: 'fobo-pro', label: 'Fobo Pro' },
]


export default function PlanNewEditForm({ currentPlan, setActiveStep, setCourseId, setPlanGroup }) {

  console.log('currentPlan', currentPlan)
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const PlanSchema = Yup.object().shape({
    paymentType: Yup.string().when('isFreePlan', {
      is: false,
      then: (schema) => schema.required('Payment type is required'),
      otherwise: (schema) => schema.strip(),
    }),
    price: Yup.number().when('isFreePlan', {
      is: false,
      then: (schema) => schema.min(0).required('Price is required'),
      otherwise: (schema) => schema.strip(),
    }),
    recurringPeriod: Yup.string().when(['isFreePlan', 'paymentType'], {
      is: (isFreePlan, paymentType) => !isFreePlan && paymentType === 'recurring',
      then: (schema) => schema.required('Recurring period is required'),
      otherwise: (schema) => schema.strip(),
    }),
    planType: Yup.string().required('Features are required'),
    planGroup: Yup.number().required('Plan group are required'),
    description: Yup.string().required('Description is required'),
    productData: Yup.object().when('planGroup', {
      is: (val) => val === '1' || val === 1,
      then: (schema) =>
        schema.shape({
          serviceName: Yup.string().required('Service name is required'),
          features: Yup.array().of(Yup.string().required('Features are required')).min(1, 'At least One Feature is required'),
          page: Yup.object()
            .nullable()
            .when('$isEdit', {
              is: true,
              then: (s) => s.nullable(),         // not required on edit
              otherwise: (s) => s.required('Page is required'),
            }),

        }),
      otherwise: (schema) =>
        schema.shape({
          courseName: Yup.string().required('Course name is required'),
          heading: Yup.string().required('Course heading is required'),
          courseType: Yup.string().required('Course type is required'),
          lmsId: Yup.string().required('LMS ID is required'),
          features: Yup.array().of(Yup.string().required('Features are required')).min(1, 'At least One Feature is required'),
          effort: Yup.string().required('Effort is required'),
          format: Yup.array().of(Yup.object().required('Format is required')).min(1, 'Please select at least one option'),
          courseDuration: Yup.string().required('Course duration is required'),
          thumbnail: Yup.mixed().nullable().required('Thumbnail is required'),
        }),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      price: currentPlan?.price || '',
      paymentType: currentPlan?.paymentType || 'oneTime',
      recurringPeriod: currentPlan?.recurringPeriod || '',
      planType: currentPlan?.planType ? currentPlan?.planType?.toString() : '0',
      isFreePlan: currentPlan?.isFreePlan || false,
      planGroup: currentPlan?.planGroup?.toString() || '0',
      // eslint-disable-next-line no-nested-ternary
      description: currentPlan?.planGroup === 0 ? currentPlan?.courses?.description : currentPlan?.planGroup === 1 ? currentPlan?.services?.description : '',
      productData:
        currentPlan?.planGroup === 0
          ? {
            courseName: currentPlan?.courses?.courseName || '',
            heading: currentPlan?.courses?.heading || '',
            courseType: currentPlan?.courses?.courseType || '',
            lmsId: currentPlan?.courses?.lmsId || '',
            features: currentPlan?.courses?.features || [],
            effort: currentPlan?.courses?.effort || '',
            format: currentPlan?.courses?.format?.length > 0
              ? currentPlan.courses.format
                .map((opt) => format.find((f) => f.value === opt))
                .filter(Boolean)
              : [],
            courseDuration: currentPlan?.courses?.courseDuration || '',
            thumbnail: currentPlan?.courses?.thumbnail || null,
          }
          : {
            serviceName: currentPlan?.services?.serviceName || '',
            features: currentPlan?.services?.features || [],
            page: currentPlan?.services?.page ? pages.find((f) => f.value === currentPlan.services.page) : null,

            description: currentPlan?.services?.description || '',
          },
    }),
    [currentPlan]
  );

  const methods = useForm({
    resolver: yupResolver(PlanSchema),
    defaultValues,
    context: { isEdit: !!currentPlan },
  });

  const { reset, watch, setValue, handleSubmit, formState: { isSubmitting, errors } } = methods;
  const values = watch();

  useEffect(() => {
    if (setPlanGroup) {
      setPlanGroup(Number(values.planGroup));
    }
  }, [values.planGroup, setPlanGroup]);

  console.log({ errors });

  // ⚡ Fix: Reset form whenever currentPlan changes


  useEffect(() => {
    if (currentPlan && currentPlan.planGroup === 1) {
      setValue(
        "productData.page",
        pages.find((p) => p.value === currentPlan?.services?.page) || null,
        { shouldValidate: false }
      );
    }
  }, [currentPlan, setValue]);

  useEffect(() => {
    if (currentPlan) {
      reset(defaultValues);
    }
  }, [currentPlan, reset, defaultValues]);


  const onSubmit = handleSubmit(async (data) => {
    try {
      const planGroupNumber = Number(data.planGroup);

      const inputData = {
        plan: {
          price: data.isFreePlan ? 0 : data.price,
          paymentType: data.isFreePlan ? 'oneTime' : data.paymentType,
          recurringPeriod: !data.isFreePlan && data.paymentType === 'recurring' ? data.recurringPeriod : '',
          planType: Number(data.planType),
          isFreePlan: data.isFreePlan,
          planGroup: planGroupNumber,
          isDeleted: false,
        },
        productData:
          planGroupNumber === 0
            ? {
              courseName: data?.productData?.courseName || '',
              heading: data?.productData?.heading || '',
              courseType: data?.productData?.courseType || '',
              lmsId: data?.productData?.lmsId || '',
              features: data?.productData?.features || '',
              description: data?.description || '',
              courseDuration: data?.productData?.courseDuration || '',
              thumbnail: data?.productData?.thumbnail || null,
              format: data?.productData?.format?.length > 0 ? data?.productData?.format?.map((opt) => opt.value) : [],
              effort: data?.productData?.effort || ''
            }
            : {
              serviceName: data?.productData?.serviceName || '',
              features: data?.productData?.features || '',
              description: data?.description || '',
              page: data?.productData?.page?.value || '',

            },
      };

      if (!currentPlan) {
        const response = await axiosInstance.post('/plans', inputData);
        if (response.data && planGroupNumber === 0) {
          setCourseId(response?.data?.coursesId);
          setActiveStep(1);
        }
      } else {
        console.log({ currentPlan });
        axiosInstance.patch(`/plans/${currentPlan.id}`, inputData);
        setActiveStep(1);
      }

      reset();
      enqueueSnackbar(currentPlan ? 'Plan updated successfully!' : 'Plan created successfully!');

      if (planGroupNumber === 1) {
        router.push(paths.dashboard.plan.serviceList);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error?.error?.message || 'Something went wrong', {
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

              <RHFSelect name="planGroup" label="Plan Group">
                {planGroupOption.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect name="isFreePlan" label="Free Plan..?">
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
                    <RHFSelect name="recurringPeriod" label="Recurring Period">
                      {RECURRING_PERIOD_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                      ))}
                    </RHFSelect>
                  )}
                </>
              )}

              <RHFSelect name="planType" label="Plan Type">
                {planType.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </RHFSelect>

              {Number(values.planGroup) === 0 ? <CourseFieldsComponents format={format} /> : <ServiceFieldsComponents pages={pages} disablePageField={currentPlan} />}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" color='success' loading={isSubmitting}>
                {!currentPlan ? 'Create Product' : 'Save Changes'}
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
  setActiveStep: PropTypes.func,
  setCourseId: PropTypes.func,
  setPlanGroup: PropTypes.func,
};
