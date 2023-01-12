import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "../../../redux/hooks";
import { projectSelectors, removeProject, setProject } from "../../../redux/slices/projectSlice";
import * as Yup from "yup";
import { Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Link, Typography } from "@mui/material";
import { NoData } from "../../../components/NoData";
import { Form, Formik } from "formik";
import CustomTextfield from "../../../components/FormsUI/CustomTextfield";
import { LoadingButton } from "@mui/lab";
import { Project, ProjectFormValues } from "../../../models/project";
import { toast } from "react-toastify";
import agent from "../../../utils/agent";
import { Delete, Edit } from "@mui/icons-material";
import { CustomDeleteDialog } from "../../../components/CustomDeleteDialog";

export const Projects: React.FC = () => {

    const projects = useSelector(projectSelectors.selectAll);
    const dispatch = useDispatch();

    // dialog related
    const [dialogOpen, setDialogOpen] = useState(false);
    const [projectFormValues, setProjectFormValues] = useState<ProjectFormValues>({
        title: "",
        description: "",
        link: "",
        cover: ""
    });
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false, title: '',
        onConfirm: function () { }
    });
    const [target, setTarget] = useState(0);
    const [loading, setLoading] = useState(false);


    const validationSchema = Yup.object({
        title: Yup.string().required('The project title is required.').max(20, "The project title cannot exceed 20 characters"),
        description: Yup.string().required('The project description is required.').max(50, "The project description cannot exceed 50 characters"),
        link: Yup.string().required('The project description is required.').max(50, "The project description cannot exceed 50 characters")
    });

    function handleProjectClick(id: number) {
        const project = projects.find(p => p.id == id);
        if (project) {
            setProjectFormValues({
                id: project.id,
                title: project.title,
                description: project.description,
                link: project.link,
                cover: project.cover
            });
            setDialogOpen(true);
        }
    }

    async function handleDialogSubmit(projectFormValues: ProjectFormValues) {
        try {
            let response: Project;
            if (projectFormValues.id) {
                response = await agent.Projects.update(projectFormValues);
            } else {
                response = await agent.Projects.create(projectFormValues);
            }
            dispatch(setProject(response));
        } catch (error) {
            console.log(error);
        }
        setDialogOpen(false);
    }

    async function handleProjectDelete(id: number) {
        setLoading(true);
        setTarget(id);
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        });
        agent.Projects.delete(id)
            .then(() => {
                dispatch(removeProject(id));
                toast.success("Project deleted");
            })
            .catch((error: any) => {
                console.log(error);
                toast.error("Error deleting project");
            }).finally(() => setLoading(false));
    }

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
                        onClick={() => {
                            setProjectFormValues({
                                title: "",
                                description: "",
                                link: "",
                                cover: ""
                            })
                            setDialogOpen(true);
                        }}
                    >
                        NEW
                    </Button>
                </Grid>
            </Grid>
            {projects!.length > 0 ?
                <Grid container item
                    marginTop={1}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4,1fr)",
                        columnGap: ".5vw",
                        rowGap: "1.5vh"
                    }}
                >
                    {projects?.map((project) => (
                        <Card key={project.id}
                            elevation={4}
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
                                        justifyContent: "space-between",
                                        color: "secondary.main"
                                    }
                                }
                            }}
                        >
                            <CardMedia
                                className="hover-image"
                                component="img"
                                height="100%"
                                image={project.cover != "" ? project.cover : "/assets/placeholder.png"}
                                sx={{
                                    objectFit: "cover"
                                }}
                            />

                            <CardContent
                                className="hover-actions"
                                sx={{
                                    display: "none",
                                    flexDirection: "column",
                                    position: "absolute",
                                    left: 0,
                                    top: 0
                                }}
                            >
                                <Typography variant="h5"
                                    target="_blank"
                                    component={Link}
                                    href={project.link}
                                    color="secondary.main"
                                    sx={{
                                        textDecoration: "none",
                                        boxShadow: "none"
                                    }}
                                >
                                    {project.title}
                                </Typography>
                                <Divider sx={{
                                    backgroundColor: "secondary.main",
                                    borderBottomWidth: 3
                                }} />
                                <Typography variant="h6">
                                    {project.description}
                                </Typography>
                            </CardContent>

                            <CardActions
                                className="hover-actions"
                                sx={{
                                    position: "absolute",
                                    display: "none",
                                    bottom: 0,
                                    right: 0
                                }}
                            >
                                <IconButton
                                    color="secondary"
                                    sx={{
                                        backgroundColor: "transparent",
                                        ":hover": {
                                            backgroundColor: "transparent"
                                        }
                                    }}
                                    onClick={() => handleProjectClick(project.id)}
                                    disabled={loading && target == project.id}
                                >
                                    <Edit
                                        sx={{
                                            ":hover": {
                                                color: "secondary.light"
                                            }
                                        }}
                                    />
                                </IconButton>
                                <IconButton
                                    color="secondary"
                                    sx={{
                                        backgroundColor: "transparent",
                                        ":hover": {
                                            backgroundColor: "transparent"
                                        }
                                    }}
                                    onClick={() => {
                                        setConfirmDialog({
                                            isOpen: true,
                                            title: 'project',
                                            onConfirm: () => { handleProjectDelete(project.id) }
                                        })
                                    }}
                                    disabled={loading && target == project.id}
                                >
                                    <Delete
                                        sx={{
                                            ":hover": {
                                                color: "secondary.light"
                                            }
                                        }}
                                    />
                                </IconButton>
                            </CardActions>

                        </Card>
                    ))}
                </Grid>
                :
                <NoData />
            }
            <Dialog open={dialogOpen}>
                <DialogTitle>
                    {projectFormValues.id ? "Update Project" : "Add Project"}
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={projectFormValues}
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
                                        margin: ".5vw 0"
                                    }}
                                />
                                <CustomTextfield
                                    name="description"
                                    label="Description"
                                    fullWidth
                                    sx={{
                                        margin: ".5vw 0"
                                    }}
                                />
                                <CustomTextfield
                                    name="link"
                                    label="Link"
                                    fullWidth
                                    sx={{
                                        margin: ".5vw 0"
                                    }}
                                />
                                <CustomTextfield
                                    name="cover"
                                    label="Cover"
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
                                        {projectFormValues.id ? "Update" : "Add"}
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
            <CustomDeleteDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </>
    )
}
