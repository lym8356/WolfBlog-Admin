import { FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { useField } from "formik";

interface Props {
    name: string;
    options: Object[] | null;
    label?: string;
    multiple?: boolean;
}

export default function CustomSelectInput(props: Props) {
    const [field, meta, helpers] = useField(props.name!);
    return (
        <FormControl fullWidth error={!!meta.error}>
            <InputLabel>{props.label}</InputLabel>
            {props.multiple ? (
                <Select
                    fullWidth
                    value={field.value ?? []}
                    input={<OutlinedInput label={props.label} />}
                    onChange={(event) => helpers.setValue(event.target.value)}
                    multiple={props.multiple}
                    MenuProps={{
                        sx: {
                            '&& .Mui-selected': {
                                backgroundColor: 'secondary.main'
                            }
                        }
                    }}
                >
                    {props.options?.map((item: any) => (
                        <MenuItem key={item.id} value={item.id} >
                            {item.title}
                        </MenuItem>
                    ))}
                </Select>
            ) : (
                <Select
                    fullWidth
                    value={field.value ?? ""}
                    input={<OutlinedInput label={props.label} />}
                    onChange={(event) => helpers.setValue(event.target.value)}
                    MenuProps={{
                        sx: {
                            '&& .Mui-selected': {
                                backgroundColor: 'secondary.main'
                            }
                        }
                    }}
                >
                    {props.options?.map((item: any) => (
                        <MenuItem key={item.id} value={item.id} >{item.title}</MenuItem>
                    ))}
                </Select>
            )}
            <FormHelperText>{meta.error}</FormHelperText>
        </FormControl>
    )
}