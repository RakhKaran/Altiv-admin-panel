import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'src/routes/hook';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Stack, Grid, Typography, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUpload,
  RHFSelect,
} from 'src/components/hook-form';

import axiosInstance, { endpoints }  from 'src/utils/axios';

const PERMISSION_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'customer', label: 'Customer' },
];

export default function UserNewEditForm({ currentUser }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const isEdit = Boolean(currentUser?.id);

  const UserSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    dob: Yup.string().required('Date of Birth is required'),
    fullAddress: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    email: Yup.string().required('Email is required').email(),
    password: isEdit ? Yup.string() : Yup.string().required('Password is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    profileDescription: Yup.string(),
    designation: Yup.string(),
    permissions: Yup.string().required('Select a permission'),
    linkedinUrl: Yup.string().url('Enter a valid LinkedIn URL'),
    avatar: Yup.mixed(),
    backgroundImage: Yup.mixed,
  });

  const defaultValues = useMemo(() => ({
    fullName: currentUser?.fullName || '',
    dob: currentUser?.dob || '',
    fullAddress: currentUser?.fullAddress || '',
    city: currentUser?.city || '',
    state: currentUser?.state || '',
    email: currentUser?.email || '',
    password: '',
    phoneNumber: currentUser?.phoneNumber || '',
    profileDescription: currentUser?.profileDescription || '',
    designation: currentUser?.designation || '',
    permissions: currentUser?.permissions?.[0] || '',
    linkedinUrl: currentUser?.linkedinUrl || '',
    avatar: currentUser?.avatar || null,
    backgroundImage: currentUser?.backgroundImage || null,
  }), [currentUser]);

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleDrop = useCallback((field) => (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    setValue(field, newFile, { shouldValidate: true });
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        permissions: [data.permissions], 
      };

      if (isEdit) {
        await axiosInstance.patch(endpoints.user.details(currentUser.id), payload);
        enqueueSnackbar('User updated successfully');
      } else {
        await axiosInstance.post(endpoints.auth.register, payload);
        enqueueSnackbar('User created successfully');
      }

      router.push('/dashboard/user/list');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <RHFUpload
              name="avatar"
              label="Upload Avatar"
              onDrop={handleDrop('avatar')}
            />
            <Box mt={3}>
              <RHFUpload
                name="backgroundImage"
                label="Upload Background"
                onDrop={handleDrop('backgroundImage')}
              />
            </Box>
          </Card>
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
              <RHFTextField name="dob" label="Date of Birth" />
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="phoneNumber" label="Phone Number" />
              <RHFTextField name="password" label="Password" type="password" />
              <RHFTextField name="designation" label="Designation" />
              <RHFTextField name="linkedinUrl" label="LinkedIn URL" />
              <RHFTextField name="fullAddress" label="Full Address" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="state" label="State" />
              <RHFSelect name="permissions" label="Permissions">
                {PERMISSION_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField
                name="profileDescription"
                label="Profile Description"
                multiline
                rows={3}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {isEdit ? 'Save Changes' : 'Create User'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentUser: PropTypes.object,
};
