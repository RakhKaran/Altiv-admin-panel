import { Box, Chip, Grid, MenuItem, Stack, Typography } from '@mui/material';

import { useSnackbar } from 'src/components/snackbar';
import { useCallback } from 'react';
import FormProvider, {
  RHFTextField,
  RHFEditor,
  RHFUpload,
  RHFAutocomplete,
  RHFUploadBox,
  RHFSelect,

} from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { useFormContext } from 'react-hook-form';
import { MultiFilePreview } from 'src/components/upload';
import { Note } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

const CourseFieldsComponents = ({format}) => {
  const {
    watch,
    setValue,
  } = useFormContext();
  const values = watch();
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
    setValue('productData.thumbnail', null, { shouldValidate: true });
  }, [setValue]);


  return (
    <>
      <RHFTextField name="productData.courseName" label="Course Name" type="string" />
      <RHFTextField name="productData.heading" label="Course heading" type="string" />
      <RHFTextField name="productData.courseType" label="Course type" type="string" />
      <RHFTextField name="productData.lmsId" label="lmsId" type="string" />
      <RHFTextField name="productData.courseDuration" label="Course Duration" type="string" />
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


      <RHFAutocomplete
        name="productData.format"
        label="Format"
        placeholder="+ Format"
        multiple
        options={format}
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





      <RHFTextField name="productData.effort" label="Effort" type="string" helperText="Enter effort like:-2-3 h / week" />


      <Box sx={{ gridColumn: 'span 2' }}>
        <RHFEditor simple name="description" sx={{ height: 200 }} />
      </Box>


      <Box sx={{ gridColumn: 'span 2' }}>
        <Typography variant="subtitle2">thumbnail</Typography>
        <RHFUploadBox
          name="productData.thumbnail"
          maxSize={3145728}
          onDrop={handleDrop}
          onDelete={handleRemoveFile}
        />
        {values.productData.thumbnail && <MultiFilePreview
          thumbnail
          files={[values.productData.thumbnail]}
          onRemove={handleRemoveFile}
        />}
      </Box>

    </>
  )
}

export default CourseFieldsComponents;

CourseFieldsComponents.propTypes = {
  format: PropTypes.array
}