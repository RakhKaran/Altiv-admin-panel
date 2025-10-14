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
            append({ moduleName: '', modules: '' });
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
                        <Grid container spacing={6} alignItems="flex-start">

                            <Grid item xs={12} sm={4}>
                                <RHFTextField
                                    name={`programModule[${index}].moduleName`}
                                    label={`Module ${index + 1} - Name`}
                                    fullWidth
                                />
                            </Grid>

                            {/* Modules Description */}
                            <Grid item xs={12} sm={4}>
                                <RHFAutocomplete
                                    name={`programModule[${index}].modules`}
                                    label="Modules"
                                    placeholder="+ Modules"
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
                                        selected.map((option,) => (
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
                    onClick={() => append({ moduleName: '', modules: '' })}
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

export default function ProgramModule({ currentModules, courseId, setActiveStep }) {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const schema = Yup.object().shape({
        programModule: Yup.array().of(
            Yup.object().shape({
                moduleName: Yup.string().required('Module Name is required'),
                modules: Yup.array().of(Yup.string().required('Module is required')).min(1, "Atleast one module is required")
            })
        ),
    });

    const defaultValues = useMemo(() => ({
        programModule:
            currentModules?.length > 0
                ? currentModules.map((outcome) => ({
                    moduleName: outcome?.moduleName || '',
                    modules: outcome?.modules || '',
                }))
                : [{ moduleName: '', modules: '' }],
    }), [currentModules])

    console.log({ courseId })


    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });

    const { reset, watch, setValue, handleSubmit, formState: { isSubmitting, errors } } = methods;

    useEffect(() => {
        if (currentModules) {
            reset(defaultValues);
        }
    }, [currentModules, reset, defaultValues]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const inputData = data?.programModule?.map((outcome) => ({
                ...outcome,
                coursesId: courseId
            }))

            if (!currentModules) {
                const response = await axiosInstance.post('/program-modules/create-all', inputData);
                if (response.data.success) {
                    enqueueSnackbar(response.data.message, { variant: 'success' });
                    setActiveStep(3);
                   
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
                const response = await axiosInstance.patch(`/program-modules/update-all`, inputData);
                if (response.data.success) {
                    enqueueSnackbar(response.data.message, { variant: 'success' });
                     setActiveStep(3);
                  
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
                            Program Modules
                        </Typography>

                        <RenderProgramModule name="programModule" />

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
                            {currentModules?.length > 0 && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => setActiveStep(1)}
                                >
                                    Back
                                </Button>
                            )}

                            <LoadingButton type="submit" variant="contained" color='success' loading={isSubmitting}>
                                {!currentModules ? 'Create' : 'Save'}
                            </LoadingButton>
                        </Box>

                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}

ProgramModule.propTypes = {
    currentModules: PropTypes.array,
    setActiveStep: PropTypes.func,
    courseId: PropTypes.number
};
