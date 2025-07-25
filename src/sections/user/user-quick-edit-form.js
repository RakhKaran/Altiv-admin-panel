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
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
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

import { DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem, TextField } from '@mui/material';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useBoolean } from 'src/hooks/use-boolean';
// import { _fullNames } from 'src/_mock';


// ----------------------------------------------------------------------

export default function UserQuickEditForm({ currentUser, open, onClose, refreshUsers }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const USER_STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: '1', label: 'Active' },
  { value: '0', label: 'Non-Active' },
];

  const NewUserSchema = Yup.object().shape({
    fullName: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    fullAddress: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    permissions: Yup.string().required('Role is required'),
    isActive:Yup.string().required('Status is required'),

  });

  const defaultValues = useMemo(
    () => ({
      fullName: currentUser?.fullName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      fullAddress: currentUser?.fullAddress || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      permissions: currentUser?.permissions[0] || '',
      isActive:currentUser?.isActive ? '1' : '0' || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();



  const onSubmit = handleSubmit(async (formData) => {
    console.log("Submit Triggered");
    try {
      console.info('DATA', formData);

      const inputData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        fullAddress: formData.fullAddress,
        state: formData.state,
        city: formData.city,
        permissions: [formData.permissions],
        isDeleted: false,
        isActive: true
      };
      await axiosInstance.patch(`/api/users/${currentUser.id}`, inputData);
      refreshUsers();
      reset();
      onClose();
      enqueueSnackbar('User updated successfully!');
      router.push(paths.dashboard.user.list);
    } catch (error) {
      console.error(error);
      console.log("error generating user..!")
      enqueueSnackbar(typeof error === 'string' ? error : error?.error?.message || 'something went wrong', {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit} >
        <DialogTitle>Quick Update</DialogTitle>
        <DialogContent>
          {!currentUser?.isActive && (
            <Alert variant="outlined" severity="error" sx={{ mb: 3 }}>
              Account is In-Active
            </Alert>
          )}

          <Box
            mt={2}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFSelect name="isActive" label="Status">
              {USER_STATUS_OPTIONS.map((isActive) => (
                <MenuItem key={isActive.value} value={isActive.value}>
                  {isActive.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <RHFTextField name="fullName" label="Full Name" />
            <RHFTextField name="email" label="Email" />
            <RHFTextField name="phoneNumber" label="Phone Number" />
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
          </Box>
        </DialogContent>


        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>

        </DialogActions>


      </FormProvider >
    </Dialog>
  );
}

UserQuickEditForm.propTypes = {
  currentUser: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refreshUsers: PropTypes.func,

};
