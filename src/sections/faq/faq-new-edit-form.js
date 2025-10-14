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
import Button from '@mui/material/Button';
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
import { useGetFaqCategories } from 'src/api/faqCategory';
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

import { IconButton, InputAdornment, MenuItem, TextField } from '@mui/material';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useBoolean } from 'src/hooks/use-boolean';

// import { _fullNames } from 'src/_mock';


export default function FaqNewEditForm({ currentFaq }) {

    console.log('currentFaq', currentFaq);
  const router = useRouter();

  const [faqCategoryData, setFaqCategoryData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const password = useBoolean();

  const {faqCategories,faqCategoriesLoading}= useGetFaqCategories();

  console.log('faqCategories', faqCategories);

  useEffect(() => {
    if (faqCategories && !faqCategoriesLoading) {
      setFaqCategoryData(faqCategories);
    }
   },[faqCategories, faqCategoriesLoading]);

  const FaqSchema = Yup.object().shape({
    question: Yup.string().required('Name is required'),
    answer: Yup.string().required('Answer is required'),
    faqCategory: Yup.object().required('Category is required'),
  });

  const defaultValues = useMemo(
    () => ({
      question: currentFaq?.question || '',
      answer: currentFaq?.answer || '',
      faqCategory: currentFaq?.faqCategory || null,
    }),
    [currentFaq]
  );

  const methods = useForm({
    resolver: yupResolver(FaqSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // const handleDrop = useCallback((field) => (acceptedFiles) => {
  //   const file = acceptedFiles[0];
  //   const newFile = Object.assign(file, {
  //     preview: URL.createObjectURL(file),
  //   });
  //   setValue(field, newFile, { shouldValidate: true });
  // }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const inputData = {
        question: data.question,
        answer: data.answer,
        faqCategoryId: data.faqCategory.id,
      };

      if (!currentFaq) {
        await axiosInstance.post('/faqs', inputData);
      } else {
        await axiosInstance.patch(`/faqs/${currentFaq.id}`, inputData);
      }

      reset();
      enqueueSnackbar(currentFaq ? 'Faq updated successfully!' : 'Faq created successfully!');
      router.push(paths.dashboard.faq.list); 
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error?.message || 'Something went wrong', {
        variant: 'error',
      });
    }
  });



  useEffect(() => {
    if (currentFaq) {
      reset(defaultValues);
    }
  }, [currentFaq, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
       <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3} >
             
              <RHFTextField name="question" label="Question" />
              <RHFTextField name="answer" label="Answer" />
              <RHFAutocomplete
                              name="faqCategory"
                              label="Select Category"
                              autoHighlight
                              options={faqCategoryData}
                              getOptionLabel={(option) => option.categoryName}
                              filterOptions={(x) => x}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                  {option.categoryName}
                                </li>
                              )}
                            />
             </Stack>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {currentFaq ? 'Save Changes' : 'Create Category'}
              </LoadingButton>
            </Stack>
         </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

FaqNewEditForm.propTypes = {
  currentFaq: PropTypes.object,
};
