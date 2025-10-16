import { useEffect, useMemo } from 'react';
import { useFieldArray, useFormContext, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Grid,
    Button,
    Typography,
    Box,
    Chip,
    Card,
} from '@mui/material';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { LoadingButton } from '@mui/lab';

// -------------------------------------------------------------

function RenderProgramModule({ name }) {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name });
    const { enqueueSnackbar } = useSnackbar();

    // Ensure at least one field exists
    useEffect(() => {
        if (!fields.length) {
            append({ question: '', answer: '' });
        }
    }, [fields, append]);

    return (
        <Grid container direction="column" spacing={3} sx={{ mt: 2 }}>
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

                            <Grid item xs={12} >
                                <RHFTextField
                                    name={`planFaqs[${index}].question`}
                                    label="Question"
                                    fullWidth
                                />
                            </Grid>

                            {/* Modules Description */}
                            <Grid item xs={12} >
                                <RHFTextField
                                    name={`planFaqs[${index}].answer`}
                                    label="Answer"
                                    multiline
                                    minRows={3}
                                    fullWidth
                                />
                            </Grid>
                            {/* Remove button */}
                            <Grid item xs={12} sm={4}>
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
                    onClick={() => append({ question: '', answer: '' })}
                >
                    + Add Field
                </Button>
            </Grid>
        </Grid>
    );
}

RenderProgramModule.propTypes = {
    name: PropTypes.string.isRequired,
};

// -------------------------------------------------------------

export default function Faq({ currentplansFaqs, courseId, setActiveStep }) {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const schema = Yup.object().shape({
        planFaqs: Yup.array().of(
            Yup.object().shape({
                question: Yup.string().required('Question is required'),
                answer: Yup.string().required('Module is required'),
            })
        ),
    });

    const defaultValues = useMemo(() => ({
        planFaqs:
            currentplansFaqs?.length > 0
                ? currentplansFaqs.map((faq) => ({
                    question: faq?.question || '',
                    answer: faq?.answer || '',
                }))
                : [{ question: '', answer: '' }],
    }), [currentplansFaqs])

    console.log({ courseId })


    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });

    const { reset, watch, setValue, handleSubmit, formState: { isSubmitting, errors } } = methods;

    useEffect(() => {
        if (currentplansFaqs) {
            reset(defaultValues);
        }
    }, [currentplansFaqs, reset, defaultValues]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const inputData = data?.planFaqs?.map((faqs) => ({
                ...faqs,
                coursesId: courseId
            }))

            if (!currentplansFaqs) {
                const response = await axiosInstance.post('/plans-faqs/create-all', inputData);
                if (response.data.success) {
                    enqueueSnackbar(response.data.message, { variant: 'success' });
                    setActiveStep(5);
                    router.push(paths.dashboard.plan.courseList);

                }
            } else {
                // const updatedData = currentModules.map((outcome, index) => ({
                //     id: outcome?.id,
                //     moduleName: data?.programModule[index].moduleName,
                //     modules: data?.programModule[index].modules,
                // }))

                // const newOutcomes = data.programModule.slice(currentModules.length).map(outcome => ({
                //     moduleName: outcome.moduleName,
                //     modules: outcome.modules,
                //     coursesId: courseId,
                // }));

                // const finalOutcomes = [...updatedData, ...newOutcomes];
                const response = await axiosInstance.patch(`/plans-faqs/update-all`, inputData);
                if (response.data.success) {
                    enqueueSnackbar(response.data.message, { variant: 'success' });
                    setActiveStep(5);
                    router.push(paths.dashboard.plan.courseList);

                }
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar(
                typeof error === 'string'
                    ? error
                    : error?.message || 'Something went wrong',
                { variant: 'error' }
            );
        }
    });

    return (


        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid xs={12} md={12}>
                    <Card sx={{ p: 3 }}>

                        <Typography variant="h6" sx={{ mb: 2 }}>
                            FAQ
                        </Typography>

                        <RenderProgramModule name="planFaqs" />

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
                            {currentplansFaqs?.length > 0 && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => setActiveStep(1)}
                                >
                                    Back
                                </Button>
                            )}

                            <LoadingButton type="submit" variant="contained" color='success' loading={isSubmitting}>
                                {!currentplansFaqs ? 'Submit' : 'Submit'}
                            </LoadingButton>
                        </Box>

                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}

Faq.propTypes = {
    currentplansFaqs: PropTypes.array,
    setActiveStep: PropTypes.func,
    courseId: PropTypes.number
};
