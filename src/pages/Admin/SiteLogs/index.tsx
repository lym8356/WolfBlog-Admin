import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Form, Formik } from "formik";
import moment from "moment";
import { useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { CustomDeleteDialog } from "../../../components/CustomDeleteDialog";
import CustomTextfield from "../../../components/FormsUI/CustomTextfield";
import { SiteLog, SiteLogFormValues } from "../../../models/siteLog";
import { useAppDispatch, useSelector } from "../../../redux/hooks";
import { removeSiteLog, setSiteLog, siteLogSelectors } from "../../../redux/slices/siteLogSlice";
import agent from "../../../utils/agent";
import CustomDateInput from "../../../components/FormsUI/CustomDateInput";

export const SiteLogs: React.FC = () => {

    const siteLogs = useSelector(siteLogSelectors.selectAll);
    const [pageSize, setPageSize] = useState(10);
    const dispatch = useAppDispatch();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [siteLogFormValues, setSiteLogFormValues] = useState<SiteLogFormValues>({
        description: "",
        dateAdded: null
    });
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false, title: '',
        onConfirm: function () { }
    });
    const [target, setTarget] = useState(0);
    const [loading, setLoading] = useState(false);

    function handleEditClick(id: number) {
        const siteLog = siteLogs.find(s => s.id == id);
        if (siteLog) {
            setSiteLogFormValues({
                id: siteLog.id,
                description: siteLog.description,
                dateAdded: siteLog.dateAdded
            });
            setDialogOpen(true);
        }
    }

    const validationSchema = Yup.object({
        description: Yup.string().required('The site log description is required.').max(1000, "The site log description cannot exceed 1000 characters"),
        dateAdded: Yup.date().typeError("Date must be in the correct format (mm/dd/yyyy)").required('The date field is required.').nullable()
    });

    const onDelete = (id: number) => {
        setLoading(true);
        setTarget(id);
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        agent.SiteLogs.delete(id)
            .then(() => {
                dispatch(removeSiteLog(id));
                toast.success("Site log deleted");
            })
            .catch((error: any) => {
                console.log(error);
                toast.error("Error deleting Site log");
            }).finally(() => setLoading(false));
    }

    async function handleDialogSubmit(siteLogFormValues: SiteLogFormValues) {
        try {
            let response: SiteLog;
            if (siteLogFormValues.id) {
                response = await agent.SiteLogs.update(siteLogFormValues);
            } else {
                response = await agent.SiteLogs.create(siteLogFormValues);
            }
            dispatch(setSiteLog(response));
        } catch (error) {
            console.log(error);
        }
        setDialogOpen(false);
    }

    const columns: GridColDef[] = [
        {
            field: 'dateAdded', headerName: 'Date', flex: 0.3,
            minWidth: 300, headerAlign: 'center', align: 'center',
            valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY")
        },
        {
            field: 'description', headerName: 'Description', flex: 1, minWidth: 200,
            headerAlign: 'center', align: 'center',
        },
        {
            field: 'actions', headerName: 'Actions', sortable: false,
            flex: 0.3, minWidth: 100, headerAlign: 'center',
            renderCell: (params) => (
                buttonGroups(params)
            )
        }
    ];

    const buttonGroups = (params: any) => {
        return (
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }}
            >
                <Button
                    sx={{
                        color: 'secondary.main',
                        backgroundColor: 'primary.main',
                        ':hover': {
                            color: 'primary.main',
                            backgroundColor: 'secondary.light',
                        }
                    }}
                    onClick={() => handleEditClick(params.id)}
                    disabled={loading && target == params.id}
                >
                    Edit
                </Button>
                <LoadingButton
                    sx={{
                        color: 'secondary.main',
                        backgroundColor: 'primary.main',
                        ':hover': {
                            color: 'primary.main',
                            backgroundColor: 'secondary.light',
                        },
                        '& .MuiLoadingButton-loadingIndicator': {
                            color: 'secondary.main'
                        }
                    }}
                    loading={loading && target == params.id}
                    onClick={() => {
                        setConfirmDialog({
                            isOpen: true,
                            title: 'site log',
                            onConfirm: () => { onDelete(params.id) }
                        })
                    }}
                >
                    Delete
                </LoadingButton>
            </Box>
        )
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
                            setSiteLogFormValues({
                                description: "",
                                dateAdded: null
                            })
                            setDialogOpen(true);
                        }}
                    >
                        NEW
                    </Button>
                </Grid>
            </Grid>
            <Grid container item
                marginTop={1}
            >
                <DataGrid
                    autoHeight
                    rows={siteLogs}
                    columns={columns}
                    pageSize={pageSize}
                    rowsPerPageOptions={[5, 10, 20]}
                    onPageSizeChange={(newPageSize) => { setPageSize(newPageSize) }}
                    disableColumnMenu
                    disableSelectionOnClick
                    sx={{
                        '.MuiDataGrid-columnHeaders': {
                            backgroundColor: 'primary.main',
                            color: 'secondary.main',
                            fontSize: '1.2rem'
                        },
                        '.MuiDataGrid-sortIcon': {
                            color: 'secondary.main'
                        },
                        '.MuiDataGrid-row': {
                            fontSize: '1.1rem'
                        }
                    }}
                />
            </Grid>
            <Dialog open={dialogOpen} maxWidth="md" >
                <DialogTitle>
                    {siteLogFormValues.id ? "Update Site Log" : "Add Site Log"}
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={siteLogFormValues}
                        enableReinitialize
                        onSubmit={(values) => handleDialogSubmit(values)}
                        validationSchema={validationSchema}
                    >
                        {({ handleSubmit, isSubmitting }) => (
                            <Form autoComplete="false" style={{ width: "100%" }} onSubmit={handleSubmit}>
                                <CustomDateInput
                                    name="dateAdded"
                                    label="Date"
                                    fullWidth
                                    sx={{
                                        margin: ".5vw 0"
                                    }}
                                />
                                <CustomTextfield
                                    name="description"
                                    label="Description"
                                    multiline
                                    rows={3}
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
                                        {siteLogFormValues.id ? "Update" : "Add"}
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