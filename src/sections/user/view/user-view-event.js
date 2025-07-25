import React from 'react'

export default function UserViewEvent() {
  return (



    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>User Event List</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >


            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <RHFTextField name="FullName" label="Full Name" />
            <RHFTextField name="email" label="Email Address" />
            <RHFTextField name="phoneNumber" label="Phone Number" />
            <RHFTextField name="state" label="State" />
            <RHFTextField name="city" label="City" />
            <RHFTextField name="fullAddress" label="Address" />
            <RHFTextField name="permissions" label="Role">
              {[
               
                { value: 'Customer', name: 'Customer' },
                { value: 'Admin', name: 'Admin' },
               
              ].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.name}
                </MenuItem>
              ))}

            </RHFTextField>
          </Box>
        </DialogContent>

        {/* <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions> */}
      </FormProvider>
    </Dialog>
  )
}
