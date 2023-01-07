import { Upload } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
    setFiles: (files: any) => void;
}

export const ImageDropzone: React.FC<Props> = ({ setFiles }) => {

    const dzStyles = {
        border: "dashed 3px",
        borderColor: "#ABB0B8",
        borderRadius: "5px",
        textAlign: "center" as "center",
        height: "85%",
        fontSize: "5rem",
        marginTop: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column" as "column"
    }

    const dzActive = {
        borderColor: "green"
    }

    const dzError = {
        borderColor: "red"
    }

    const onDrop = useCallback((acceptedFiles: any[]) => {
        setFiles(acceptedFiles.map((file: any) => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })))
    }, [setFiles])
    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        accept: {
            'image/*': []
        },
        maxFiles: 1,
        maxSize: 10000000,
        onDrop
    })
    return (
        <div {...getRootProps()}
            style={isDragActive ? { ...dzStyles, ...dzActive } : fileRejections.length > 0 ? { ...dzStyles, ...dzError } : dzStyles} >
            <input {...getInputProps()} />
            <Upload fontSize="inherit" />
            <Typography variant="body1">
                Drop Image Here, or click to select file
            </Typography>
            <Typography variant="body2">
                (Images only, size limit 10MB)
            </Typography>
            {fileRejections.map(({ errors }) => (
                <Box>
                    {errors.map(e => (
                        <Typography key={e.code}
                            variant="body2"
                            color="red"
                        >
                            {e.message}
                        </Typography>
                    ))}
                </Box>
            ))}
        </div>
    )
}