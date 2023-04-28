import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../redux/hooks";
import { commentSelectors, removeComment } from "../../../redux/slices/commentSlice";
import agent from "../../../utils/agent";
import moment from "moment";
import { Box, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { CustomDeleteDialog } from "../../../components/CustomDeleteDialog";

const Comments: React.FC = () => {

    const comments = useSelector(commentSelectors.selectAll);
    const [pageSize, setPageSize] = useState(10);
    const dispatch = useAppDispatch();

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false, title: '',
        onConfirm: function () { }
    });
    const [target, setTarget] = useState("");
    const [loading, setLoading] = useState(false);

    const onDelete = (id: string) => {
        setLoading(true);
        setTarget(id);
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        agent.Comments.delete(id)
            .then(() => {
                dispatch(removeComment(id));
                toast.success("Comment deleted");
            })
            .catch((error: any) => {
                console.log(error);
                toast.error("Error deleting comment");
            }).finally(() => setLoading(false));
    }

    const columns: GridColDef[] = [
        {
            field: 'commenterUsername', headerName: 'Username', flex: 0.3,
            minWidth: 200, headerAlign: 'center', align: 'center',
        },
        {
            field: 'commenterEmail', headerName: 'Email', flex: 0.3,
            minWidth: 250, headerAlign: 'center', align: 'center',
        },
        {
            field: 'createdAt', headerName: 'Date', flex: 0.3,
            minWidth: 200, headerAlign: 'center', align: 'center',
            valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY")
        },
        {
            field: 'type', headerName: 'Type', flex: 0.5, minWidth: 150,
            headerAlign: 'center', align: 'center'
        },
        {
            field: 'content', headerName: 'Content', flex: 1, minWidth: 200,
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
                            title: 'comment',
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
            >
                <Box sx={{ minHeight: 800, width: "100%" }}>
                    <DataGrid
                        // autoHeight
                        rows={comments}
                        columns={columns}
                        pageSize={pageSize}
                        rowsPerPageOptions={[5, 10, 20]}
                        onPageSizeChange={(newPageSize) => { setPageSize(newPageSize) }}
                        disableColumnMenu
                        disableSelectionOnClick
                        getRowHeight={() => 'auto'}
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
                            },
                            '.MuiDataGrid-cell': {
                                whiteSpace: 'normal',
                                wordBreak: 'break-word'
                            },
                            '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: 1.5 }
                        }}
                    />
                </Box>

            </Grid>

            <CustomDeleteDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </>
    )
}

export default Comments;