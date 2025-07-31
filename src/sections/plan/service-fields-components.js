
import { Box, Chip, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'src/components/snackbar';
import { useCallback } from 'react';
import FormProvider, {
  RHFTextField,
  RHFEditor,
  RHFUpload,
  RHFAutocomplete,
  RHFUploadBox,

} from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { useFormContext } from 'react-hook-form';

const ServiceFieldsComponents = () => {
  const {
    setValue,
  } = useFormContext();
  const { enqueueSnackbar } = useSnackbar();

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await axiosInstance.post('/files', formData);
          const imageFile = response.data?.files[0];

          if (imageFile) {
            setValue('productData.thumbnail', imageFile, { shouldValidate: true });
          } else {
            enqueueSnackbar('Image upload failed: No URL returned.', { variant: 'error' });
          }
        } catch (error) {
          console.error(error);
          enqueueSnackbar('Image upload failed.', { variant: 'error' });
        }
      }
    },
    [enqueueSnackbar, setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('thumbnail', null);
  }, [setValue]);
  return (
    <>
      <RHFTextField name="productData.serviceName" label="Service Name" type="string" />
      <Box width="200%">
        <Stack spacing={1.5}>
          <RHFTextField name="productData.description" label="Description" multiline rows={3} fullWidth />
        </Stack>
        <Stack sx={{my:2}} spacing={1.5}>
          <RHFAutocomplete
            name="productData.features"
            label="Features"
            placeholder="+ Features"
            multiple
            freeSolo
            options={[]}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />
        </Stack>
        <Box sx={{ gridColumn: 'span 2' }}>
          <Typography variant="subtitle2">thumbnail</Typography>
          <RHFUploadBox
            name="productData.thumbnail"
            maxSize={3145728}
            onDrop={handleDrop}
            onDelete={handleRemoveFile}
          />
         </Box>
      </Box>
    </>
  )
}

export default ServiceFieldsComponents