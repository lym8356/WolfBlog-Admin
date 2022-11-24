import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "formik";

interface Props {
    margin?: "none" | "dense" | "normal";
    name: string;
    fullWidth?: boolean;
    label?: string;
    autoFocus?: boolean;
    required?: boolean;
    type?: string;
    variant?: "standard" | "filled" | "outlined" | undefined;
}


const CustomTextfield = (props: Props) => {
    const [field, meta] = useField(props.name);
    return (
        <TextField {...field} {...props} />
    )
}


export default CustomTextfield;