import { TextField, TextFieldProps } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useField, useFormikContext } from "formik";
import { useEffect } from "react";

export default function CustomDateInput(props: Partial<TextFieldProps>) {
    const [field, meta] = useField(props.name!);
    const { setFieldValue } = useFormikContext();

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
                label={props.label}
                value={field.value || null}
                inputFormat="DD/MM/YYYY"
                onChange={(value) => {
                    setFieldValue(field.name, value);
                }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        {...props}
                        {...field}
                        error={!!meta.error}
                        helperText={meta.error}
                    />}
            />
        </LocalizationProvider>
    )
}