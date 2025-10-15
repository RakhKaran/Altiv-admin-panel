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
// -------------------------------------------------------------

function RenderTools({ index }) {
  const { enqueueSnackbar } = useSnackbar();
  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `categoryWithTools[${index}].tools`,
  });
  const values = watch();

  const handleDrop = useCallback(
    async (acceptedFiles, toolIndex) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axiosInstance.post("/files", formData);
        const imageFile = response.data?.files?.[0];
        if (imageFile) {
          setValue(
            `categoryWithTools[${index}].tools[${toolIndex}].image`,
            imageFile,
            { shouldValidate: true, shouldDirty: true }
          );
        } else {
          enqueueSnackbar("Image upload failed: No URL returned.", {
            variant: "error",
          });
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Image upload failed.", { variant: "error" });
      }
    },
    [enqueueSnackbar, setValue, index]
  );

  const handleRemoveFile = (toolIndex) => {
    setValue(`categoryWithTools[${index}].tools[${toolIndex}].image`, null, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      {(fields || []).map((tool, toolIndex) => (
        <Grid container spacing={2} alignItems="center" key={tool.id}>
          {/* Tool Name */}
          <Grid item xs={12} sm={3}>
            <RHFTextField
              name={`categoryWithTools[${index}].tools[${toolIndex}].toolName`}
              label="Tool Name"
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12} sm={4}>
            <RHFTextField
              name={`categoryWithTools[${index}].tools[${toolIndex}].description`}
              label="Description"
            />
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12} sm={4}>
            <Box display="flex" alignItems="center" gap={1}>
              <RHFUploadBox
                name={`categoryWithTools[${index}].tools[${toolIndex}].image`}
                maxSize={3145728}
                onDrop={(files) => handleDrop(files, toolIndex)}
                onDelete={() => handleRemoveFile(toolIndex)}
              />
              {values?.categoryWithTools[index].tools[toolIndex].image && (
                <MultiFilePreview
                  thumbnail
                  files={[values?.categoryWithTools[index].tools[toolIndex].image]}
                  onRemove={() => handleRemoveFile(toolIndex)}
                />
              )}

            </Box>
          </Grid>

          {/* Remove Tool Button (same row, aligned right) */}
          <Grid
            item
            xs={12}
            sm={1}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
              color="error"
              size="small"
              variant="outlined"
              onClick={() => remove(toolIndex)}
            >
              Remove
            </Button>
          </Grid>
        </Grid>
      ))}

      {/* Add Tool Button */}
      <Button
        variant="outlined"
        size="small"
        onClick={() => append({ toolName: "", description: "", image: null })}
      >
        + Add Tool
      </Button>
    </Box>
  );
}


RenderTools.propTypes = {
  index: PropTypes.number.isRequired,
};

// -------------------------------------------------------------

function RenderCategory({ name }) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!fields.length) {
      append({ category: "", tools: [] });
    }
  }, [fields, append]);

  return (
    <Grid container direction="column" spacing={2} sx={{ mt: 2 }}>
      {fields.map((categoryField, categoryIndex) => (
        <Grid
          item
          xs={12}
          key={categoryField.id}
          sx={{ p: 2, borderRadius: 1, mb: 2, border: "1px solid #ddd" }}
        >
          {/* === Category Name + Remove Button Row === */}
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Grid item xs={10} sm={6}>
              <RHFTextField
                name={`${name}[${categoryIndex}].category`}
                label="Category"
              />
            </Grid>
            <Grid item xs="auto">
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => remove(categoryIndex)}
              >
                Remove Category
              </Button>
            </Grid>
          </Grid>

          {/* === Tools Section === */}
          <RenderTools index={categoryIndex} />
        </Grid>
      ))}

      {/* === Add Category Button === */}
      <Grid item>
        <Button
          variant="contained"
          size="small"
          type="button"
          onClick={() => append({ category: "", tools: [] })}
        >
          + Add Category
        </Button>
      </Grid>
    </Grid>
  );
}


RenderCategory.propTypes = {
  name: PropTypes.string.isRequired,
};

// -------------------------------------------------------------

export default function Tools({ courseId, setActiveStep, currentTools }) {
  console.log({ currentTools })
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const navigate = useNavigate();

  const schema = Yup.object().shape({
    categoryWithTools: Yup.array().of(
      Yup.object().shape({
        category: Yup.string().required('Category is required'),
        tools: Yup.array().of(
          Yup.object().shape({
            toolName: Yup.string().required('Tool Name is required'),
            description: Yup.string().required('Description is required'),
            image: Yup.mixed().nullable(),
          })
        ).min(1, 'At least one tool is required'),
      })
    ).min(1, 'At least one category is required'),
  });

  const defaultValues = useMemo(() => ({
    categoryWithTools: currentTools?.length > 0
      ? currentTools.map((category) => ({
        category: category?.category || '',
        tools: category?.tools?.length > 0 ? category.tools.map((tool) => ({
          toolName: tool?.toolName || '',
          description: tool?.description || '',
          image: tool?.image || null,
        })) : [],
      }))
      : [{ category: '', tools: [{ toolName: '', description: '', image: null }] }],
  }), [currentTools])

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });

  const { reset, watch, setValue, handleSubmit, formState: { isSubmitting, errors } } = methods;

  useEffect(() => {
    if (currentTools?.length && !watch('categoryWithTools')?.length) {
      reset(defaultValues);
    }
  }, [currentTools, reset, watch, defaultValues]);


  const onSubmit = handleSubmit(async (data) => {
    try {
      const inputData = data?.categoryWithTools?.map((categoryWithTool) => ({
        category: categoryWithTool.category,
        tools: categoryWithTool.tools,
        coursesId: courseId,
      }))

      console.log({ courseId })

      if (!currentTools) {
        const response = await axiosInstance.post('/tools/create-all', inputData);
        if (response.data.success) {
          enqueueSnackbar(response.data.message, { variant: 'success' });
          setActiveStep(4);
       
        }
      } else {
        // const updatedData = currentOutcomes.map((outcome, index) => ({
        //   id: outcome?.id,
        //   heading: data?.keyOutcomes[index]?.heading,
        //   description: data?.keyOutcomes[index]?.description,
        //   image: data?.keyOutcomes[index]?.image,
        // }));



        // const newOutcomes = data.keyOutcomes.slice(currentOutcomes.length).map(outcome => ({
        //   heading: outcome.heading,
        //   description: outcome.description,
        //   image: outcome.image,
        //   coursesId: courseId,

        // }));


        // const finalOutcomes = [...updatedData, ...newOutcomes];

        const response = await axiosInstance.patch(`/tools/update-all`, inputData);
        if (response.data.success) {
          enqueueSnackbar(response.data.message, { variant: 'success' });
          setActiveStep(4);
 
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
              Tools
            </Typography>

            <RenderCategory name="categoryWithTools" />

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 3 }} >
              {currentTools?.length > 0 && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setActiveStep(2)}
                >
                  Back
                </Button>
              )}

              <LoadingButton type="submit" variant="contained" color='success' loading={isSubmitting}>
                {!currentTools ? 'Create' : 'Save'}
              </LoadingButton>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

Tools.propTypes = {
  courseId: PropTypes.number,
  setActiveStep: PropTypes.func,
  currentTools: PropTypes.array
};
