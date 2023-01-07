import { Info } from "@mui/icons-material";
import { Button, Card, CardActionArea, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tooltip, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NoData } from "../../../components/NoData";
import { useSelector } from "../../../redux/hooks";
import { albumSelectors, setAlbum } from "../../../redux/slices/albumSlice";
import CustomTextfield from "../../../components/FormsUI/CustomTextfield";
import { LoadingButton } from "@mui/lab";
import { AlbumFormValues } from "../../../models/album";
import { useDispatch } from "react-redux";
import agent from "../../../utils/agent";
import { toast } from "react-toastify";


const Albums: React.FC = () => {

    const albums = useSelector(albumSelectors.selectAll);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // dialog related
    const [dialogOpen, setDialogOpen] = useState(false);
    const validationSchema = Yup.object({
        title: Yup.string().required('The album title is required.').max(20, "The album title cannot exceed 20 characters"),
        description: Yup.string().required('The album description is required.').max(50, "The album description cannot exceed 50 characters")
    });

    async function handleDialogSubmit(albumFormValues: AlbumFormValues) {
        const sameAlbum = albums?.filter(item => item.title.toLowerCase() === albumFormValues.title.toLowerCase());
        if (sameAlbum.length) {
            toast.error("Album with the same name already exists.");
        } else {
            try {
                const response = await agent.Albums.create(albumFormValues);
                dispatch(setAlbum(response));
            } catch (error) {
                console.log(error);
            }
        }
        setDialogOpen(false);
    }

    // const albums:any[] = [];
    return (
        <>
            <Grid container item
                marginTop={1}
                marginRight={1}
                sx={{
                    display: 'flex',
                    justifyContent: 'right',
                    alignItems: 'center'
                }}
            >
                <Grid item xs={1}
                    sx={{
                        display: "flex",
                        alignItems: "right"
                    }}
                >
                    <Tooltip title="Cloudinary issue: Avoid using edit album"
                        placement="right"
                        arrow
                    >
                        <Info fontSize="large" />
                    </Tooltip>
                </Grid>
                <Grid item xs={1}>
                    <Button
                        size="large"
                        sx={{
                            width: '100%',
                            color: 'secondary.main',
                            backgroundColor: 'primary.main',
                            ':hover': {
                                color: 'primary.main',
                                backgroundColor: 'secondary.light',
                            }
                        }}
                        onClick={() => setDialogOpen(true)}
                    >
                        NEW
                    </Button>
                </Grid>
            </Grid>
            {albums!.length > 0 ?
                <Grid container item
                    marginTop={1}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4,1fr)",
                        columnGap: ".5vw",
                        rowGap: "1.5vh"
                    }}
                >
                    {albums?.map((album) => (
                        <Card key={album.id}
                            elevation={4}
                            sx={{
                                width: "20vw",
                                height: "30vh"
                            }}
                        >
                            <CardActionArea
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    overflow: "auto"
                                }}
                                onClick={() => { navigate(`/admin/albums/${album.id}`) }}
                            >
                                <CardMedia
                                    component="img"
                                    image={album.cover != "" ? album.cover : "/assets/placeholder.png"}
                                    sx={{
                                        width: "100%",
                                        height: "70%",
                                        objectFit: "cover",
                                    }}
                                />
                                <CardContent
                                    sx={{
                                        height: "30%"
                                    }}
                                >
                                    <Typography variant="h6">
                                        {album.title}
                                    </Typography>
                                    <Typography variant="body1">
                                        {album.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </Grid>
                :
                <NoData />
            }
            <Dialog open={dialogOpen}>
                <DialogTitle>
                    Add Album
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{ title: "", description: "" }}
                        onSubmit={(values) => handleDialogSubmit(values)}
                        validationSchema={validationSchema}
                    >
                        {({ handleSubmit, isSubmitting }) => (
                            <Form autoComplete="false" style={{ width: "100%" }} onSubmit={handleSubmit}>
                                <CustomTextfield
                                    name="title"
                                    label="Title"
                                    fullWidth
                                    sx={{
                                        margin: "1vw 0"
                                    }}
                                />
                                <CustomTextfield
                                    name="description"
                                    label="description"
                                    fullWidth
                                    sx={{
                                        margin: ".5vw 0"
                                    }}
                                />
                                <DialogActions>
                                    <LoadingButton
                                        size="medium"
                                        variant="contained"
                                        type="submit"
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                        sx={{
                                            backgroundColor: 'primary.main',
                                            color: 'secondary.main',
                                            ':hover': {
                                                backgroundColor: 'secondary.light',
                                                color: 'primary.main'
                                            }
                                        }}

                                    >
                                        Create
                                    </LoadingButton>
                                    <LoadingButton
                                        size="medium"
                                        variant="contained"
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() => { setDialogOpen(false) }}
                                        sx={{
                                            backgroundColor: 'primary.main',
                                            color: 'secondary.main',
                                            ':hover': {
                                                backgroundColor: 'secondary.light',
                                                color: 'primary.main'
                                            }
                                        }}
                                    >
                                        Cancel
                                    </LoadingButton>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Albums;