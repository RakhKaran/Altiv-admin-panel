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

const PERMISSION_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'customer', label: 'Customer' },
];

export default function UserNewEditForm({ currentUser }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const password = useBoolean();

  const UserSchema = Yup.object().shape({
    fullName: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    fullAddress: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    permissions: Yup.string().required('Role is required'),
    linkedinUrl: Yup.string(),
    dob: Yup.string(),
    avatar: Yup.mixed().nullable(),
    profileDescription: Yup.string(),

    password: currentUser ? Yup.string() : Yup.string().required('Password is required'),
    newPassword: currentUser ? Yup.string() : Yup.string().required('Confirm password is required'),
  });

  const defaultValues = useMemo(
    () => ({
      fullName: currentUser?.fullName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      fullAddress: currentUser?.fullAddress || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      permissions: currentUser?.permissions || '',
      linkedinUrl: currentUser?.linkedinUrl || '',
      dob: currentUser?.dob || '',
      avatar: currentUser?.avatar || null,
      profileDescription: currentUser?.profileDescription || '',
      password: '',
      newPassword: '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(UserSchema),
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

  const onSubmit = handleSubmit(async (formData) => {
    console.log('Submit Triggered');
    try {
      console.info('DATA', formData);

      const inputData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        fullAddress: formData.fullAddress,
        // password: '',
        state: formData.state,
        city: formData.city,
        permissions: [formData.permissions],
        linkedinUrl: formData.linkedinUrl,
        dob: formData.dob,
        profileDescription: formData.profileDescription,
        isDeleted: false,
        isActive: true,
      };
      if (formData.avatar) {
        inputData.avatar = {
          fileUrl: formData.avatar,
        };
      }

      if (!currentUser) {
        inputData.password = formData.password;

        await axiosInstance.post('/register', inputData);
        enqueueSnackbar('User created successfully!');
      } else if (currentUser?.id) {
        await axiosInstance.patch(`/api/users/${currentUser.id}`, inputData);
        enqueueSnackbar('User updated successfully!');
      } else {
        enqueueSnackbar('User ID not found for update.', { variant: 'error' });
      }

      reset();
      router.push(paths.dashboard.user.list);
    } catch (error) {
      console.error(error);
      console.log('error generating user..!');
      enqueueSnackbar(
        typeof error === 'string' ? error : error?.error?.message || 'something went wrong',
        {
          variant: 'error',
        }
      );
    }
  });

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post('/files', formData);
        const { data } = response;
        console.log(data);
        setValue('avatar', data?.files[0].fileUrl, {
          shouldValidate: true,
        });
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ pt: 10, pb: 5, px: 3 }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            {currentUser && (
              <Label
                color={(values.isActive && 'success') || (!values.isActive && 'error') || 'warning'}
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.isActive ? 'Active' : 'Non-Active'}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatar"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Grid>
        </Grid>

        <Grid xs={12} md={8}>
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
              <RHFTextField name="fullName" label="Full Name" />
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="phoneNumber" label="Phone Number" type="number" />

              {/* <RHFTextField name="password" label="Password" type="password" /> */}

              <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="fullAddress" label="address" />
              <RHFSelect fullWidth name="permissions" label="Role">
                {[
                  { value: 'customer', name: 'Customer' },
                  { value: 'admin', name: 'Admin' },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              {/* <RHFTextField name="password" label="password" /> */}

              {!currentUser ? (
                <>
                  <RHFTextField
                    name="password"
                    label="Password"
                    type={password.value ? 'text' : 'password'}
                    autoComplete="new-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={password.onToggle} edge="end">
                            <Iconify
                              icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <RHFTextField
                    name="newPassword"
                    label="Confirm New Password"
                    type={password.value ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={password.onToggle} edge="end">
                            <Iconify
                              icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              ) : null}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {currentUser ? 'Save Changes' : 'Create User'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Card>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentUser: PropTypes.object,
};
