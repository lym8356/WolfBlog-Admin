import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "formik";

const CustomTextfield = (props: Partial<TextFieldProps>) => {
    const [field, meta] = useField(props.name!);
    return (
        <TextField
            {...field}
            {...props}
            error={!!meta.error}
            helperText={meta.error}
        />
    )
}

export default CustomTextfield;