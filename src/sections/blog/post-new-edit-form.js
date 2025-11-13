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
import { Box, createFilterOptions, IconButton, InputAdornment, MenuItem } from '@mui/material';
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
  RHFSelect,
} from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { useGetCategories } from 'src/api/category';
import Iconify from 'src/components/iconify';
import PostDetailsPreview from './post-details-preview';


const blogTypes = [
  { value: 'blog', label: 'Blog' },
  { value: 'company-fobo', label: 'Comapny Fobo' },

];

export default function PostNewEditForm({ currentPost }) {
  const { categories, categoriesEmpty } = useGetCategories();
  const [categoryData, setCategoryData] = useState([]);
  const [slugStatus, setSlugStatus] = useState(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const preview = useBoolean();

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    slug: Yup.string().required('Slug is required'),
    description: Yup.string().required('Description is required'),
    content: Yup.string().required('Content is required'),
    coverUrl: Yup.mixed().nullable(),
    coverAlt: Yup.string(),
    tags: Yup.array().min(2, 'Must have at least 2 tags'),
    publish: Yup.string().required('Status is required i.e(publish or draft or unpublish)'),
    categories: Yup.array().of(Yup.object()).min(1, 'Atleast one category is required'),
    blogType: Yup.string().required('Blog type must be required'),
    companyUrl: Yup.string().when('blogType', {
      is: (val) => val === 'company-fobo',
      then: (schema) =>
        schema
          .required('Company URL is required for Company Fobo type')
          .matches(
            /^(https?:\/\/)(localhost|\d{1,3}(\.\d{1,3}){3}|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(:\d+)?(\/.*)?$/,
            'Enter a valid URL'
          ),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
    authorName: Yup.string(),
    designation: Yup.string(),
    authorImage: Yup.mixed().nullable(),
    metaTitle: Yup.string().required('Meta title is required').max(60, 'Maximum character limit is 60'),
    metaDescription: Yup.string().required('Meta description is required').max(160, 'Maximum character limit is 160'),
    canonicalURL: Yup.string()
      .required('URL is required')
      .matches(
        /^(https?:\/\/)(localhost|\d{1,3}(\.\d{1,3}){3}|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(:\d+)?(\/.*)?$/,
        'Enter a valid URL'
      ),
    isIndexed: Yup.boolean().required('Indexed value is required'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentPost?.title || '',
      slug: currentPost?.slug || '',
      blogType: currentPost?.blogType || '',
      companyUrl: currentPost?.companyUrl || '',
      description: currentPost?.description || '',
      content: currentPost?.content || '',
      coverUrl: currentPost?.coverUrl || null,
      coverAlt: currentPost?.coverAlt || '',
      tags: currentPost?.tags || [],
      publish: currentPost?.publish || 'draft',
      categories: currentPost?.categories || [],
      authorName: currentPost?.authorName || '',
      designation: currentPost?.designation || '',
      authorImage: currentPost?.authorImage || null,
      metaTitle: currentPost?.metaTitle || '',
      metaDescription: currentPost?.metaDescription || '',
      canonicalURL: currentPost?.canonicalURL || '',
      isIndexed: currentPost?.isIndexed || true,
    }),
    [currentPost]
  );

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const { reset, watch, setValue, handleSubmit, formState: { isSubmitting, isValid } } = methods;
  const watchedValues = watch();

  // Reset form when currentPost changes
  useEffect(() => {
    if (currentPost && currentPost.title && categories) {
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset, categories]);

  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const checkSlugAvailability = useCallback(
    async (slug) => {
      if (!slug) {
        setSlugStatus(null);
        return;
      }

      try {
        const response = await axiosInstance.get(`/blogs/slug/${slug}`);
        const blog = response.data;

        if (blog && blog.id) {
          if (currentPost && currentPost.id === blog.id) {
            setSlugStatus('available');
          } else {
            setSlugStatus('unavailable');
          }
        } else {
          setSlugStatus('available');
        }
      } catch (err) {
        console.error('Error checking slug:', err);
        setSlugStatus('available');
      }
    },
    [currentPost, setSlugStatus]
  );

  // Debounce slug availability
  useEffect(() => {
    const handler = setTimeout(() => {
      if (watchedValues.slug) checkSlugAvailability(watchedValues.slug);
    }, 500);
    return () => clearTimeout(handler);
  }, [watchedValues.slug, checkSlugAvailability]);

  const renderSlugHelper = () => {
    if (slugStatus === 'available') return <Typography color="green">Available</Typography>;
    if (slugStatus === 'unavailable') return <Typography color="red">Not Available</Typography>;
    return '';
  };

  useEffect(() => {
    if (categories && !categoriesEmpty) {
      setCategoryData(categories);
    } else {
      setCategoryData([]);
    }
  }, [categories, categoriesEmpty]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const inputData = {
        title: data.title,
        slug: data.slug,
        blogType: data.blogType,
        companyUrl: data.companyUrl,
        description: data.description,
        content: data.content,
        coverUrl: data.coverUrl,
        coverAlt: data.coverAlt,
        tags: data.tags,
        publish: data.publish,
        categories: data.categories?.map((cat) => cat.id) || [],
        authorName: data.authorName,
        designation: data.designation,
        authorImage: data.authorImage,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        canonicalURL: data.canonicalURL,
        isIndexed: data.isIndexed
      };

      if (!currentPost) {
        await axiosInstance.post('/blogs', inputData);
      } else {
        await axiosInstance.patch(`/blogs/${currentPost.id}`, inputData);
      }

      reset();
      enqueueSnackbar(currentPost ? 'Blog updated successfully!' : 'Blog created successfully!');
      router.push(paths.dashboard.post.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        typeof error === 'string' ? error : error?.message || 'Something went wrong',
        { variant: 'error' }
      );
    }
  });

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axiosInstance.post('/files', formData);
        const imageUrl = response.data?.files[0]?.fileUrl;
        if (imageUrl) setValue('coverUrl', imageUrl, { shouldValidate: true });
        else enqueueSnackbar('Image upload failed: No URL returned.', { variant: 'error' });
      } catch {
        enqueueSnackbar('Image upload failed.', { variant: 'error' });
      }
    },
    [enqueueSnackbar, setValue]
  );

  const handleRemoveFile = useCallback(() => setValue('coverUrl', null), [setValue]);

  const handleAuthorImageDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axiosInstance.post('/files', formData);
        const imageUrl = response.data?.files[0]?.fileUrl;
        if (imageUrl) setValue('authorImage', imageUrl, { shouldValidate: true });
        else enqueueSnackbar('Author image upload failed: No URL returned.', { variant: 'error' });
      } catch {
        enqueueSnackbar('Author image upload failed.', { variant: 'error' });
      }
    },
    [enqueueSnackbar, setValue]
  );

  const handleRemoveAuthorImage = useCallback(() => setValue('authorImage', null), [setValue]);

  const filter = createFilterOptions({ matchFrom: 'any', stringify: (option) => option.name });

  useEffect(() => {
    if (watchedValues.slug !== '' && !watchedValues.canonicalURL) {
      setValue('canonicalURL', `${process.env.REACT_APP_FRONTEND_URL}/${watchedValues.slug}`, { shouldValidate: true });
    }
  }, [watchedValues.slug, setValue, watchedValues.canonicalURL])

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card>
            {!mdUp && <CardHeader title="Details" />}
            <Stack spacing={3} sx={{ p: 3 }}>
              <RHFSelect
                fullWidth
                name="blogType"
                label="Blog Type"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {blogTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              {watchedValues.blogType === 'company-fobo' && (
                <RHFTextField name="companyUrl" label="Company URL" />
              )}


              <RHFTextField name="title" label="Post Title" />
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <RHFTextField name="title" label="Post Title" />

                <RHFTextField
                  name="slug"
                  label="Slug"
                  placeholder="custom-slug"
                  onChange={(e) => {
                    setValue('slug', e.target.value, { shouldValidate: true });
                    setSlugManuallyEdited(true);
                  }}
                  onBlur={(e) => checkSlugAvailability(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            const titleSlug = generateSlug(watchedValues.title || '');
                            const currentSlug = watchedValues.slug || '';
                            const extra = currentSlug.startsWith(titleSlug) ? currentSlug.slice(titleSlug.length) : '';
                            const finalSlug = titleSlug + extra;

                            if (finalSlug !== currentSlug) {
                              setValue('slug', finalSlug, { shouldValidate: true });
                            }

                            checkSlugAvailability(finalSlug);
                          }}
                          edge="end"
                        >
                          <Iconify icon="eva:refresh-outline" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText={renderSlugHelper()}
                />
              </Stack>

              <RHFTextField name="description" label="Description" multiline rows={3} />
              <RHFTextField name="authorName" label="Author Name" />
              <RHFTextField name="designation" label="Designation" />

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Author Image</Typography>
                <RHFUpload
                  name="authorImage"
                  maxSize={3145728}
                  onDrop={handleAuthorImageDrop}
                  onDelete={handleRemoveAuthorImage}
                />
              </Stack>

              <RHFAutocomplete
                multiple
                name="categories"
                label="Categories"
                options={categoryData || []}
                getOptionLabel={(option) => `${option?.name}` || ''}
                filterOptions={filter}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option) => (
                  <li {...props}>
                    <div>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {`${option?.name}`}
                      </Typography>
                    </div>
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      label={option.name}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Content</Typography>
                <RHFEditor simple name="content" />
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Cover</Typography>
                <RHFUpload
                  name="coverUrl"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onDelete={handleRemoveFile}
                />
              </Stack>
              <RHFTextField name="coverAlt" label="Alter Text For Img" />

              <Typography variant="h5" gutterBottom>
                SEO Settings
              </Typography>

              {/* Meta Title */}
              <RHFTextField
                name="metaTitle"
                label="Meta Title"
                helperText="📝 Recommended: up to 60 characters for best display in search results."
                inputProps={{ maxLength: 60 }}
              />

              {/* Meta Description */}
              <RHFTextField
                name="metaDescription"
                label="Meta Description"
                multiline
                minRows={3}
                helperText="📝 Recommended: up to 160 characters for best SEO performance."
                inputProps={{ maxLength: 160 }}
              />

              {/* Canonical URL */}
              <RHFTextField
                name="canonicalURL"
                label="Canonical URL"
                placeholder="https://example.com/blog/post-url"
              />

              {/* Tags */}
              <RHFAutocomplete
                name="tags"
                label="Tags"
                placeholder="+ Add Tags"
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

              {/* Switches: Is Indexed & Publish */}
              <Stack direction="row" spacing={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={watchedValues.isIndexed === true}
                      onChange={(e) =>
                        setValue('isIndexed', e.target.checked, { shouldValidate: true })
                      }
                    />
                  }
                  label="Is Indexed"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={watchedValues.publish === 'published'}
                      onChange={(e) =>
                        setValue('publish', e.target.checked ? 'published' : 'draft', {
                          shouldValidate: true,
                        })
                      }
                    />
                  }
                  label="Publish"
                />
              </Stack>

              {/* Schema Markup (JSON-LD) */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Schema Markup (JSON-LD)
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  This structured data helps Google understand your blog content better. It’s automatically generated based on your inputs.
                </Typography>

                <Box
                  component="pre"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.neutral',
                    fontSize: 13,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {JSON.stringify(
                    {
                      '@context': 'https://schema.org',
                      '@type': 'BlogPosting',
                      headline: watchedValues.metaTitle || '',
                      description: watchedValues.metaDescription || '',
                      image: watchedValues.coverUrl || '',
                      author: {
                        '@type': 'Person',
                        name: watchedValues.authorName || 'Anonymous',
                      },
                      publisher: {
                        '@type': 'Organization',
                        name: 'Altiv',
                        logo: {
                          '@type': 'ImageObject',
                          url: `${process.env.REACT_APP_FRONTEND_URL}/assets/Altivlogo.png`,
                        },
                      },
                      datePublished: new Date().toISOString(),
                      mainEntityOfPage: {
                        '@type': 'WebPage',
                        '@id': watchedValues.canonicalURL || '',
                      },
                    },
                    null,
                    2
                  )}
                </Box>
              </Box>

              <Box xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', pl: 0 }}>
                <Button variant="outlined" onClick={preview.onTrue}>
                  Preview
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  sx={{ ml: 2 }}
                >
                  {currentPost ? 'Save Changes' : 'Create Post'}
                </LoadingButton>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <PostDetailsPreview
        title={watchedValues.title}
        content={watchedValues.content}
        description={watchedValues.description}
        coverUrl={typeof watchedValues.coverUrl === 'string' ? watchedValues.coverUrl : watchedValues.coverUrl?.preview}
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
