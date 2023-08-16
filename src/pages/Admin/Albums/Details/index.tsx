import { useNavigate, useParams } from "react-router-dom";
import { NotFound } from "../../../../components/NotFound";
import { useAppDispatch, useSelector } from "../../../../redux/hooks";
import { albumSelectors, deleteImageAsync, removeAlbum, setAlbum, setCoverAsync, uploadImageAsync } from "../../../../redux/slices/albumSlice";
import LoadingComponent from "../../../Layout/LoadingComponent";
import CustomTextfield from "../../../../components/FormsUI/CustomTextfield";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import { SyntheticEvent, useEffect, useState } from "react";
import { Album, AlbumFormValues } from "../../../../models/album";
import { Button, Card, CardActions, CardMedia, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Book, Delete } from "@mui/icons-material";
import { ImageUploadWidget } from "../../../../components/ImageUploadWidget/ImageUploadWidget";
import { Image } from "../../../../models/image";
import agent from "../../../../utils/agent";
import { toast } from "react-toastify";
import { CustomDeleteDialog } from "../../../../components/CustomDeleteDialog";

const AlbumDetails: React.FC = () => {

    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const albums = useSelector(albumSelectors.selectAll);
    const album = useSelector(state => albumSelectors.selectById(state, id as string));
    const { loading } = useSelector(state => state.album);
    const [albumFormValues, setAlbumFormValues] = useState<AlbumFormValues>({ title: "", description: "" });
    const [addImageMode, setAddImageMode] = useState(false);
    const [target, setTarget] = useState('');

    // for delete dialog
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false, title: '',
        onConfirm: function () { }
    });
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (album) setAlbumFormValues({ id: album.id, title: album.title, description: album.description });
    }, [dispatch, album])

    const validationSchema = Yup.object({
        title: Yup.string().required('The album title is required.').max(20, "The album title cannot exceed 20 characters"),
        description: Yup.string().required('The album description is required.').max(50, "The album description cannot exceed 50 characters")
    })

    async function handleUpdateAlbum(albumFormValues: AlbumFormValues, setSubmitting: (isSubmitting: boolean) => void) {
        albumFormValues.id = album!.id;
        const sameAlbum = albums?.filter(item => item.title.toLowerCase() === albumFormValues.title.toLowerCase());
        if (sameAlbum.length) {
            toast.error("Album with the same name already exists.");
            setSubmitting(false);
            return;
        }
        try {
            const response: Album = await agent.Albums.update(albumFormValues);
            dispatch(setAlbum(response));
            toast.success("Album Updated");
        } catch (error) {
            console.log(error);
            toast.error("Error performing action");
        }
    }

    async function handleDeleteAlbum(id: number) {
        setDeleteLoading(true);
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        agent.Albums.delete(id)
            .then(() => {
                dispatch(removeAlbum(id));
                toast.success("Album deleted");
                navigate("/albums");
            })
            .catch((error: any) => {
                console.log(error);
                toast.error("Error deleting article");
            }).finally(() => setDeleteLoading(false));
    }

    async function handleImageUpload(file: Blob) {
        if (album) {
            const id: number = album.id;
            await dispatch(uploadImageAsync({ file: file, albumId: id }));
            setAddImageMode(false);
        }
    }

    async function handleSetCoverImage(image: Image, e: SyntheticEvent<HTMLButtonElement>) {
        if (album) {
            setTarget(e.currentTarget.name);
            await dispatch(setCoverAsync({ albumId: album.id, imageId: image.id }));
        }
    }

    async function handleDeleteImage(image: Image, e: SyntheticEvent<HTMLButtonElement>) {
        if (album) {
            setTarget(e.currentTarget.name);
            await dispatch(deleteImageAsync({ albumId: album.id, imageId: image.id }));
        }
    }

    if (loading) return <LoadingComponent />

    if (id && !album) return <NotFound />

    return (
        <>
            <Formik
                initialValues={albumFormValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => { handleUpdateAlbum(values, setSubmitting) }}
            >
                {({ isSubmitting }) => (
                    <Form autoComplete="false" style={{ width: "100%" }}>
                        <Grid container item
                            columns={16}
                            sx={{
                                marginTop: '1vh',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Grid item xs={5}>
                                <CustomTextfield
                                    name="title"
                                    label="Title"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CustomTextfield
                                    name="description"
                                    label="Descripton"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={4}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-around'
                                }}
                            >
                                <LoadingButton
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    sx={{
                                        backgroundColor: 'primary.main',
                                        color: 'secondary.main',
                                        ':hover': {
                                            backgroundColor: 'secondary.light',
                                            color: 'primary.main'
                                        }
                                    }}

                                >
                                    UPDATE
                                </LoadingButton>
                                <LoadingButton
                                    size="large"
                                    variant="contained"
                                    type="button"
                                    disabled={isSubmitting}
                                    loading={deleteLoading}
                                    onClick={() => {
                                        setConfirmDialog({
                                            isOpen: true,
                                            title: 'album',
                                            onConfirm: () => { handleDeleteAlbum(album!.id) }
                                        })
                                    }}
                                    sx={{
                                        backgroundColor: 'primary.main',
                                        color: 'secondary.main',
                                        ':hover': {
                                            backgroundColor: 'secondary.light',
                                            color: 'primary.main'
                                        }
                                    }}

                                >
                                    Delete
                                </LoadingButton>
                                <Button
                                    size="large"
                                    variant="contained"
                                    type="button"
                                    disabled={isSubmitting || deleteLoading}
                                    onClick={() => { setAddImageMode(!addImageMode) }}
                                    sx={{
                                        backgroundColor: 'primary.main',
                                        color: 'secondary.main',
                                        ':hover': {
                                            backgroundColor: 'secondary.light',
                                            color: 'primary.main'
                                        }
                                    }}
                                >
                                    {addImageMode ? 'Cancel' : 'Upload'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
            <Grid container item>
                {addImageMode ? (
                    <ImageUploadWidget loading={loading} uploadImage={handleImageUpload} />
                ) : (
                    <Grid container item
                        sx={{
                            marginTop: '1vh',
                            display: 'grid',
                            gridTemplateColumns: "repeat(4, 1fr)",
                            columnGap: "10px"
                        }}
                    >
                        {album?.albumPhotos.map((image) => (
                            <Card key={image.id}
                                sx={{
                                    width: "20vw",
                                    height: "30vh",
                                    position: "relative",
                                    ":hover": {
                                        "& .hover-image": {
                                            filter: "brightness(50%)"
                                        },
                                        "& .hover-actions": {
                                            display: "flex",
                                            justifyContent: "space-between"
                                        }
                                    }
                                }}
                            >
                                <CardMedia
                                    className="hover-image"
                                    component="img"
                                    height="100%"
                                    image={image.url}
                                    sx={{
                                        objectFit: "cover"
                                    }}
                                />
                                <CardActions
                                    className="hover-actions"
                                    sx={{
                                        position: "absolute",
                                        display: "none",
                                        bottom: 0
                                    }}
                                >
                                    <LoadingButton
                                        startIcon={<Book />}
                                        disabled={image.url === album.cover}
                                        sx={{
                                            backgroundColor: 'primary.main',
                                            color: 'secondary.main',
                                            ":disabled": {
                                                backgroundColor: "black",
                                                color: "grey"
                                            },
                                            ':hover': {
                                                backgroundColor: 'secondary.light',
                                                color: 'primary.main'
                                            }
                                        }}
                                        loading={target === '' && loading}
                                        onClick={e => handleSetCoverImage(image, e)}
                                    >
                                        Set Cover
                                    </LoadingButton>
                                    <LoadingButton
                                        startIcon={<Delete />}
                                        sx={{
                                            backgroundColor: 'primary.main',
                                            color: 'secondary.main',
                                            ':hover': {
                                                backgroundColor: 'secondary.light',
                                                color: 'primary.main'
                                            }
                                        }}
                                        loading={target === '' && loading}
                                        onClick={e => handleDeleteImage(image, e)}
                                    >
                                        Delete
                                    </LoadingButton>
                                </CardActions>
                            </Card>
                        ))}

                    </Grid>
                )}
            </Grid>
            <CustomDeleteDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </>
    )
}

export default AlbumDetails;