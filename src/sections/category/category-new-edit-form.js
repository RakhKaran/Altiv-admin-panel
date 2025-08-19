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
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
// utils
import { fData } from 'src/utils/format-number';
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
// import { _fullNames } from 'src/_mock';


export default function CategoryNewEditForm({ currentCategory }) {

    console.log('currentCategory', currentCategory);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const password = useBoolean();

  const CategorySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCategory?.name || '',
      description: currentCategory?.description || '',
    }),
    [currentCategory]
  );

  const methods = useForm({
    resolver: yupResolver(CategorySchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // const handleDrop = useCallback((field) => (acceptedFiles) => {
  //   const file = acceptedFiles[0];
  //   const newFile = Object.assign(file, {
  //     preview: URL.createObjectURL(file),
  //   });
  //   setValue(field, newFile, { shouldValidate: true });
  // }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const inputData = {
        name: data.name,
        description: data.description,
      };

      if (!currentCategory) {
        await axiosInstance.post('/categories', inputData);
      } else {
        await axiosInstance.patch(`/categories/${currentCategory.id}`, inputData);
      }

      reset();
      enqueueSnackbar(currentCategory ? 'Category updated successfully!' : 'Category created successfully!');
      router.push(paths.dashboard.category.list); 
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error?.message || 'Something went wrong', {
        variant: 'error',
      });
    }
  });



  useEffect(() => {
    if (currentCategory) {
      reset(defaultValues);
    }
  }, [currentCategory, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
       <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3} >
             
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="description" label="Description" />
             </Stack>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {currentCategory ? 'Save Changes' : 'Create Category'}
              </LoadingButton>
            </Stack>
         </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

CategoryNewEditForm.propTypes = {
  currentCategory: PropTypes.object,
};
