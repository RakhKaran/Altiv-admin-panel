import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// utils

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// assets

// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect } from 'src/components/hook-form';
import RHFSwitch from 'src/components/hook-form/rhf-switch';
import RHFTextField from 'src/components/hook-form/rhf-text-field';
import { RHFUploadAvatar } from 'src/components/hook-form/rhf-upload';
import RHFAutocomplete from 'src/components/hook-form/rhf-autocomplete';

import { IconButton, InputAdornment, MenuItem, TextField } from '@mui/material';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useBoolean } from 'src/hooks/use-boolean';
import { useFilterPlans } from 'src/api/plan';

// import { _fullNames } from 'src/_mock';
const status = [
  { value: true, label: 'Active' },
  { value: false, label: 'In-Active' },
];

export default function BatchesNewEditForm({ currentBatches }) {
  const [plansData, setPlansData] = useState([]);

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const filter = {
    where: {
      planGroup: 0
    }
  };

  const filterString = encodeURIComponent(JSON.stringify(filter))
  const { filteredPlans, filterLoading } = useFilterPlans(filterString);
  console.log('filter plans', filteredPlans)
  useEffect(() => {
    if (filteredPlans && !filterLoading) {
      setPlansData(filteredPlans);
    }
  }, [filteredPlans, filterLoading]);




  const BatchSchema = Yup.object().shape({
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date().required('End date is required'),
    plan: Yup.object().required('Plan is required'),
    isActive: Yup.boolean().required('Value is required')
  });

  const defaultValues = useMemo(
    () => ({
      startDate: currentBatches?.startDate || '',
      endDate: currentBatches?.endDate || '',
      plan: currentBatches?.plan || null,
      isActive: currentBatches?.isActive ?? true,
    }),
    [currentBatches]
  );

  const methods = useForm({
    resolver: yupResolver(BatchSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  console.log({ errors })
  const values = watch();


  const onSubmit = handleSubmit(async (data) => {
    try {
      const inputData = {
        startDate: data.startDate,
        endDate: data.endDate,
        planId: data.plan.id,
        isActive: data.isActive,
      };

      if (!currentBatches) {
        await axiosInstance.post('/batches', inputData);
      } else {
        await axiosInstance.patch(`/batches/${currentBatches.id}`, inputData);
      }

      reset();
      enqueueSnackbar(currentBatches ? 'Batch updated successfully!' : 'Batch created successfully!');
      router.push(paths.dashboard.batches.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error?.message || 'Something went wrong', {
        variant: 'error',
      });
    }
  });


  console.log({ defaultValues })
  useEffect(() => {
    if (currentBatches) {
      console.log('currentBatches', currentBatches.isActive);
      reset(defaultValues);
    }
  }, [currentBatches, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3} >

              {currentBatches && (
                <RHFSelect name="isActive" label="Status">
                  {status.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}
              <RHFAutocomplete
                name="plan"
                label="Select Course"
                autoHighlight
                options={plansData}
                getOptionLabel={(option) => option.courses.courseName}
                filterOptions={(x) => x}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.courses.courseName}
                  </li>
                )}
              />

              <Controller
                name="startDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Start Date"
                    value={new Date(field.value)}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="endDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="End Date"
                    value={new Date(field.value)}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Stack>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {currentBatches ? 'Save Changes' : 'Create Batches'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

BatchesNewEditForm.propTypes = {
  currentBatches: PropTypes.object,
};
