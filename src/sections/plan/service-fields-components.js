
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
import PropTypes from 'prop-types';



const ServiceFieldsComponents = ({pages, disablePageField}) => {
  const {
    setValue,
  } = useFormContext();
  const { enqueueSnackbar } = useSnackbar();

  // const handleDrop = useCallback(
  //   async (acceptedFiles) => {
  //     const file = acceptedFiles[0];

  //     if (file) {
  //       const formData = new FormData();
  //       formData.append('file', file);

  //       try {
  //         const response = await axiosInstance.post('/files', formData);
  //         const imageFile = response.data?.files[0];

  //         if (imageFile) {
  //           setValue('productData.thumbnail', imageFile, { shouldValidate: true });
  //         } else {
  //           enqueueSnackbar('Image upload failed: No URL returned.', { variant: 'error' });
  //         }
  //       } catch (error) {
  //         console.error(error);
  //         enqueueSnackbar('Image upload failed.', { variant: 'error' });
  //       }
  //     }
  //   },
  //   [enqueueSnackbar, setValue]
  // );

  // const handleRemoveFile = useCallback(() => {
  //   setValue('thumbnail', null);
  // }, [setValue]);
  return (
    <>
      <RHFTextField name="productData.serviceName" label="Service Name" type="string" />
  
         <Box sx={{ gridColumn: 'span 2' }}>
        <RHFEditor simple name="description" sx={{ height: 200 }} />
      </Box>
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
      
             <Stack sx={{my:2}} spacing={1.5}>
                <RHFAutocomplete
                  name="productData.page"
                  label="Pages"
                  placeholder="+ page"
                  multiple={false}
                  options={pages}
                  disabled={disablePageField}
                  getOptionLabel={(option) => option.label || ''}
              
                  renderOption={(props, option) => (
                    <li {...props} key={option.value}>
                      {option.label}
                    </li>
                  )}
                  renderTags={(selected, getTagProps) =>
                    selected.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.value}
                        label={option.label}
                        size="small"
                        color="info"
                        variant="soft"
                      />
                    ))
                  }
                />
                </Stack>
    </>
  )
}

export default ServiceFieldsComponents;

ServiceFieldsComponents.propTypes = {
  pages: PropTypes.array,
  disablePageField: PropTypes.bool
}