import { Check, Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Grid, Typography } from "@mui/material"
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { ImageCropper } from "./ImageCropper";
import { ImageDropzone } from "./ImageDropzone"

interface Props {
    loading: boolean;
    uploadImage: (file: Blob) => void;
}

export const ImageUploadWidget: React.FC<Props> = ({ loading, uploadImage }) => {
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadImage(blob!));
        }
    }

    useEffect(() => {
        return () => {
            files.forEach((file: any) => {
                URL.revokeObjectURL(file.preview);
            });
        }
    }, [files])

    return (
        <>
            <Grid container item marginTop={1}
                sx={{
                    height: '30vh',
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: "nowrap",
                    overflow: 'auto'
                }}
            >
                <Grid item xs={4}>
                    <Typography variant="h5" align="center"
                        sx={{
                            height: "10%",
                            marginBottom: 1
                        }}
                    >
                        Step 1: Add Image
                    </Typography>
                    <ImageDropzone setFiles={setFiles} />
                </Grid>
            </Grid>
            <Grid container item >
                <Grid item xs={6}
                    sx={{
                        maxHeight: "45vh"
                    }}
                >
                    <Typography variant="h5" align="center">
                        Step 2: Resize Image
                    </Typography>
                    {files && files.length > 0 && (
                        <ImageCropper setCropper={setCropper} imagePreview={files[0].preview} />
                    )}
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5" align="center">
                        Step 3: Preview & Upload
                    </Typography>
                    {files && files.length > 0 && (
                        <>
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <Box component="div" className="img-preview"
                                    sx={{
                                        width: "100%",
                                        height: "300px",
                                        border: "solid 3px #ABB0B8",
                                        overflow: "hidden"
                                    }}
                                />
                                <Box
                                    sx={{
                                        width: "50%",
                                        display: "flex",
                                        justifyContent: "space-evenly",
                                        margin: 1
                                    }}
                                >
                                    <LoadingButton
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "primary.main",
                                            color: "secondary.main",
                                            ":hover": {
                                                backgroundColor: "secondary.main",
                                                "& .MuiSvgIcon-root": {
                                                    color: "primary.main"
                                                }
                                            }
                                        }}
                                        loading={loading}
                                        onClick={onCrop}
                                    >
                                        <Check color="secondary" />
                                    </LoadingButton>
                                    <LoadingButton
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "primary.main",
                                            color: "secondary.main",
                                            ":hover": {
                                                backgroundColor: "secondary.main",
                                                "& .MuiSvgIcon-root": {
                                                    color: "primary.main"
                                                }
                                            }
                                        }}
                                        disabled={loading}
                                        onClick={() => setFiles([])}
                                    >
                                        <Close color="secondary" />
                                    </LoadingButton>
                                </Box>
                            </Box>
                        </>
                    )}
                </Grid>
            </Grid>
        </>
    )
}