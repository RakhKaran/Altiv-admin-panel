import { useCallback, useEffect, useMemo } from 'react';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Grid,
  Button,
  Typography,
  Box,
  Card,
} from '@mui/material';
import FormProvider, { RHFTextField, RHFUploadBox } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { MultiFilePreview } from 'src/components/upload';
import Stack from 'src/theme/overrides/components/stack';
import { useNavigate } from 'react-router';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { id } from 'date-fns/locale';



// -------------------------------------------------------------

function RenderKeyOutcomes({ name }) {
  const { control, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });
  const { enqueueSnackbar } = useSnackbar();

  const values = watch();

  // Ensure at least one field exists
  useEffect(() => {
    if (!fields.length) {
      append({ heading: '', description: '', image: '' });
    }
  }, [fields, append]);

  // Handle file upload
  const handleDrop = useCallback(
    async (acceptedFiles, index) => {
      const file = acceptedFiles[0];

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await axiosInstance.post('/files', formData);
          const imageFile = response.data?.files?.[0];

          if (imageFile) {
            setValue(`keyOutcomes[${index}].image`, imageFile, { shouldValidate: true, shouldDirty: true });
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

  const handleRemoveFile = useCallback(
    (index) => {
      setValue(`keyOutcomes[${index}].image`, null, { shouldValidate: true });
    },
    [setValue]
  );

  return (
    <Grid container direction="column" spacing={2} sx={{ mt: 2 }}>

      {fields.map((field, index) => {
        const fieldPath = `${name}[${index}]`;

        return (
          <Grid
            item
            xs={12}
            key={field.id}
            sx={{
              p: 2,
              borderRadius: 1,

              mb: 2,
            }}
          >

            <Grid container spacing={2} alignItems="flex-start">
              {/* Heading */}
              <Grid item xs={12} sm={4}>
                <RHFTextField name={`keyOutcomes[${index}].heading`} label="Heading" fullWidth />
              </Grid>

              {/* Description */}
              <Grid item xs={12} sm={4}>
                <RHFTextField name={`keyOutcomes[${index}].description`} label="Description" fullWidth />
              </Grid>


              <Grid item xs={12} sm={3}>
                <Box display="flex" alignItems="center" gap={1}>

                  <RHFUploadBox
                    name={`keyOutcomes[${index}].image`}
                    maxSize={3145728}
                    onDrop={(files) => {
                      handleDrop(files, index);

                    }}
                    onDelete={() => handleRemoveFile(index)}
                  />
                  {values?.keyOutcomes[index].image && (
                    <MultiFilePreview
                      thumbnail
                      files={[values?.keyOutcomes[index].image]}
                      onRemove={() => handleRemoveFile(index)}
                    />
                  )}
                </Box>
              </Grid>


              {/* Remove button */}
              <Grid item xs={12} sm={1}>
                <Button
                  color="error"
                  size="small"
                  variant="outlined"
                  onClick={() => remove(index)}
                  sx={{ mt: 1 }}
                >
                  Remove
                </Button>
              </Grid>

            </Grid>
          </Grid>
        );
      })}

      <Grid item>
        <Button
          variant="outlined"
          size="small"
          type="button"
          onClick={() => append({ heading: '', description: '', image: '' })}
        >
          + Add Field
        </Button>

      </Grid>
    </Grid>
  );
}

RenderKeyOutcomes.propTypes = {
  name: PropTypes.string.isRequired,
};

// -------------------------------------------------------------

export default function KeyOutcomes({ courseId, setActiveStep, currentOutcomes }) {
  console.log({ currentOutcomes })
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const navigate = useNavigate();

  const schema = Yup.object().shape({
    keyOutcomes: Yup.array().of(
      Yup.object().shape({
        heading: Yup.string().required('Heading is required'),
        description: Yup.string().required('Description is required'),
        image: Yup.mixed().nullable(),
      })
    ),
  });

  const defaultValues = useMemo(() => ({
    keyOutcomes: currentOutcomes?.length > 0
      ? currentOutcomes
      : [{ heading: '', description: '', image: '' }],
  }), [currentOutcomes])

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });

  const { reset, watch, setValue, handleSubmit, formState: { isSubmitting, errors } } = methods;

  useEffect(() => {
    if (currentOutcomes?.length && !watch('keyOutcomes')?.length) {
      reset({ keyOutcomes: currentOutcomes });
    }
  }, [currentOutcomes, reset, watch]);


  const onSubmit = handleSubmit(async (data) => {
    try {
      const inputData = data?.keyOutcomes?.map((outcome) => ({
        ...outcome,
        coursesId: courseId
      }))

      if (!currentOutcomes) {
        const response = await axiosInstance.post('/keyoutcomes/create-all', inputData);
        if (response.data.success) {
          enqueueSnackbar(response.data.message, { variant: 'success' });
          setActiveStep(2);
        }
      } else {
        const updatedData = currentOutcomes.map((outcome, index) => ({
          id: outcome?.id,
          heading: data?.keyOutcomes[index]?.heading,
          description: data?.keyOutcomes[index]?.description,
          image: data?.keyOutcomes[index]?.image,
        }));

        const newOutcomes = data.keyOutcomes.slice(currentOutcomes.length).map(outcome => ({
          heading: outcome.heading,
          description: outcome.description,
          image: outcome.image,
          coursesId: currentOutcomes[0].coursesId
        }));

        const finalOutcomes = [...updatedData, ...newOutcomes];

        const response = await axiosInstance.patch(`/keyoutcomes/update-all`, finalOutcomes);
        if (response.data.success) {
          enqueueSnackbar(response.data.message, { variant: 'success' });
          setActiveStep(2);
        }
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error?.message || 'Something went wrong', {
        variant: 'error',
      });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Key Outcomes
            </Typography>

            <RenderKeyOutcomes name="keyOutcomes" />

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 3 }} >
              {currentOutcomes?.length > 0 && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setActiveStep(0)}
                >
                  Back
                </Button>
              )}

              <LoadingButton type="submit" variant="contained" color='success' loading={isSubmitting}>
                {!currentOutcomes ? 'Create' : 'Save'}
              </LoadingButton>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

KeyOutcomes.propTypes = {
  courseId: PropTypes.number,
  setActiveStep: PropTypes.func,
  currentOutcomes: PropTypes.array
};
