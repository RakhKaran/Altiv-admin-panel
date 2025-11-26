import PropTypes from "prop-types";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Grid, Card, Box, IconButton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";

import FormProvider, { RHFTextField } from "src/components/hook-form";
import axiosInstance from "src/utils/axios";
import Iconify from "src/components/iconify";

export default function CurrentCurrencyExchangeRateForm({ currentCurrencyExchangeRate }) {
  const { enqueueSnackbar } = useSnackbar();

  const newCurrencyExchangeRateSchema = Yup.object().shape({
    baseCurrency: Yup.string().required("Base currency is required"),
    targetCurrency: Yup.string().required("Target currency is required"),
    rate: Yup.number()
      .typeError("Rate must be a number")
      .positive("Rate must be greater than 0")
      .required("Rate is required"),
  });

  const defaultValues = useMemo(
    () => ({
      baseCurrency: currentCurrencyExchangeRate?.[0]?.baseCurrency || "USD",
      targetCurrency: currentCurrencyExchangeRate?.[0]?.targetCurrency || "INR",
      rate: currentCurrencyExchangeRate?.[0]?.rate || "",
      baseAmount: 1, // always 1
      targetAmount: currentCurrencyExchangeRate?.[0]?.rate || "", // rate * 1
    }),
    [currentCurrencyExchangeRate]
  );

  const methods = useForm({
    resolver: yupResolver(newCurrencyExchangeRateSchema),
    defaultValues,
  });

  const { handleSubmit, watch, setValue, formState: { isSubmitting } } = methods;

  const values = watch();

  // Update targetAmount whenever rate changes
  const handleRateChange = (val) => {
    const numeric = Number(val);
    setValue("rate", val);

    if (!Number.isNaN(numeric) && numeric > 0) {
      setValue("targetAmount", numeric.toFixed(6));
    }
  };

  const handleSwap = () => {
    const prevBase = values.baseCurrency;
    const prevTarget = values.targetCurrency;
    const prevRate = values.rate;

    // Swap base and target currencies
    setValue("baseCurrency", prevTarget, { shouldValidate: true });
    setValue("targetCurrency", prevBase, { shouldValidate: true });

    // Swap rate mathematically
    if (prevRate > 0) {
      const newRate = 1 / Number(prevRate);
      setValue("rate", Number(newRate.toFixed(6)), { shouldValidate: true });
      setValue("targetAmount", Number(newRate.toFixed(6)));
    }
  };

  const onSubmit = handleSubmit(async (formData) => {
    try {
      if (currentCurrencyExchangeRate?.length > 0) {
        await axiosInstance.patch(
          `/currency-exchange-rates/${currentCurrencyExchangeRate[0].id}`,
          { ...currentCurrencyExchangeRate[0], ...formData }
        );
        enqueueSnackbar("Exchange Rate Updated", { variant: "success" });

      } else {
        await axiosInstance.post(`/currency-exchange-rates`, formData);
        enqueueSnackbar("Exchange Rate Created", { variant: "success" });
      }
    } catch (error) {
      enqueueSnackbar(error?.message || "Something went wrong", { variant: "error" });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">

          {/* Base currency */}
          <Grid item xs={5}>
            <RHFTextField name="baseCurrency" label="Base Currency" disabled />
          </Grid>

          {/* Swap Icon */}
          <Grid item xs={2} sx={{ textAlign: "center" }}>
            <IconButton
              onClick={handleSwap}
              sx={{
                border: "1px solid #ddd",
                borderRadius: "50%",
                width: 46,
                height: 46,
              }}
            >
              <Iconify icon="material-symbols:swap-horiz-rounded" width={26} height={26} />
            </IconButton>
          </Grid>

          {/* Target currency */}
          <Grid item xs={5}>
            <RHFTextField name="targetCurrency" label="Target Currency" disabled />
          </Grid>

          {/* Base fixed amount = 1 */}
          <Grid item xs={5}>
            <RHFTextField
              name="baseAmount"
              label="Base Amount"
              disabled
              value={1}
            />
          </Grid>

          {/* Empty center cell */}
          <Grid item xs={2}>
            {/*  */}
          </Grid>

          {/* Converted amount (rate * 1) */}
          <Grid item xs={5}>
            <RHFTextField
              name="targetAmount"
              label="Equals"
              disabled
            />
          </Grid>

          {/* Editable rate */}
          <Grid item xs={12}>
            <RHFTextField
              name="rate"
              label="Exchange Rate (1 Base = ? Target)"
              onChange={(e) => handleRateChange(e.target.value)}
            />
          </Grid>

        </Grid>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <LoadingButton
            type="submit"
            variant="contained"
            color="success"
            loading={isSubmitting}
          >
            Update
          </LoadingButton>
        </Box>
      </Card>
    </FormProvider>
  );
}

CurrentCurrencyExchangeRateForm.propTypes = {
  currentCurrencyExchangeRate: PropTypes.array,
};
