import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// _mock
import { _tags } from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { useGetCategories } from 'src/api/category';//
import PostDetailsPreview from './post-details-preview';

// ----------------------------------------------------------------------

export default function PostNewEditForm({ currentPost }) {
  const {categories, categoriesEmpty} = useGetCategories();
  const [categoryData, setCategoryData]= useState([]);

  useEffect(() => {
    if (categories && !categoriesEmpty) {
      setCategoryData(categories);
    } else {
      setCategoryData([]);
    }
  }, [categories, categoriesEmpty]);

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const preview = useBoolean();

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    content: Yup.string().required('Content is required'),
    coverUrl: Yup.mixed().nullable().required('Cover is required'),
    tags: Yup.array().min(2, 'Must have at least 2 tags'),
    publish:Yup.string().required('Status is required i.e(publish or draft or unpublish)'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentPost?.title || '',
      description: currentPost?.description || '',
      content: currentPost?.content || '',
      coverUrl: currentPost?.coverUrl || null,
      tags: currentPost?.tags || [],
      publish:currentPost?.publish || 'draft',
    }),
    [currentPost]
  );

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentPost && currentPost.title) {
      console.log('Resetting with currentPost', currentPost);
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const inputData = {
        title: data.title,
        description: data.description,
        content: data.content,
        coverUrl: data.coverUrl,
        tags: data.tags,
        publish:data.publish
      };

      if (!currentPost) {
        await axiosInstance.post('/blogs', inputData);
      } else {
        await axiosInstance.patch(`/blogs/${currentPost.id}`, inputData);
      }

      reset();
      enqueueSnackbar(currentPost ? 'Blogs updated successfully!' : 'Blogs created successfully!');
      router.push(paths.dashboard.post.list); 
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error?.message || 'Something went wrong', {
        variant: 'error',
      });
    }
  });

 const handleDrop = useCallback(
  async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axiosInstance.post('/files', formData); 
        const imageUrl = response.data?.files[0]?.fileUrl;
        
        if (imageUrl) {
          setValue('coverUrl', imageUrl, { shouldValidate: true });
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
    setValue('coverUrl', null);
  }, [setValue]);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="title" label="Post Title" />

            <RHFTextField name="description" label="Description" multiline rows={3} />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <RHFEditor simple name="content" />
            </Stack>
            <RHFAutocomplete
              name="categories"
              label="Categories"
              placeholder="Categories"
              multiple
              options={categoryData.map((option) => option.name)}
              filterOptions={(opt => opt)}
              isOptionsEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) => option.name}
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

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Cover</Typography>
              <RHFUpload
                name="coverUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFAutocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={_tags.map((option) => option)}
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

            {/* <RHFTextField name="metaTitle" label="Meta title" /> */}

            {/* <RHFTextField
              name="metaDescription"
              label="Meta description"
              fullWidth
              multiline
              rows={3}
            /> */}

            {/* <RHFAutocomplete
              name="metaKeywords"
              label="Meta keywords"
              placeholder="+ Keywords"
              multiple
              freeSolo
              disableCloseOnSelect
              options={_tags.map((option) => option)}
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
            /> */}

            {/* <FormControlLabel control={<Switch defaultChecked />} label="Enable comments" /> */}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
        <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Switch
              checked={values.publish === 'published'}
              onChange={(e) =>
                setValue('publish', e.target.checked ? 'published' : 'draft', {
                  shouldValidate: true,
                })
              }
            />
          }
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        />
        <Button variant="outlined" onClick={preview.onTrue}>Preview</Button>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 2 }}>
          {currentPost ? 'Save Changes' : 'Create Post'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Grid>

      <PostDetailsPreview
        title={values.title}
        content={values.content}
        description={values.description}
        coverUrl={
          typeof values.coverUrl === 'string' ? values.coverUrl : `${values.coverUrl?.preview}`
        }
        //
        open={preview.value}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onClose={preview.onFalse}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
}

PostNewEditForm.propTypes = {
  currentPost: PropTypes.object,
};
