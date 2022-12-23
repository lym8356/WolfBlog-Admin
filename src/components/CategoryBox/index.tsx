import { Delete, Edit } from "@mui/icons-material"
import {
    Button,
    Card, CardContent,
    CardHeader, CircularProgress, IconButton,
    Table, TableBody,
    TableCell, TableContainer,
    TableRow, TextField, TextFieldProps
} from "@mui/material"
import { Box } from "@mui/system"
import { useRef, useState } from "react"
import { toast } from "react-toastify"
import { Category, CategoryFormValues } from "../../models/category"
import { useAppDispatch, useSelector } from "../../redux/hooks"
import { createCategoryAsync } from "../../redux/slices/categorySlice"
import { CustomDialog } from "../CustomDialog"

interface Props {
    categories: Category[] | null;
}

export const CategoryBox: React.FC<Props> = ({ categories }) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [category, setCategory] = useState({});
    const { loading } = useSelector(state => state.category);
    const dispatch = useAppDispatch();
    const formValues = useRef<TextFieldProps>(null);

    const handleAddClick = () => {
        // validate for null input
        const formValuesAsString = formValues.current?.value as string;
        if (formValuesAsString.trim() === '' ) {
            toast.error("Title cannot be empty");
            return;
        }
        // validate for duplicate category name
        const sameCategory = categories?.filter(item => item.title === formValuesAsString);
        if (sameCategory?.length) {
            toast.error("Category with the same name already exists");
            return;
        }

        const newCategory: CategoryFormValues = {
            title: formValues.current?.value as string
        }
        dispatch(createCategoryAsync(newCategory));
    }

    const handleEditClick = (id: number) => {
        setIsDelete(false);
        // process logic then
        const categoryToEdit = categories?.find(c => c.id == id);
        if (categoryToEdit != undefined) setCategory(categoryToEdit);
        setDialogOpen(true);
    }

    const handleDeleteClick = (id: number) => {
        setIsDelete(true);
        // process logic then
        const categoryToDelete = categories?.find(c => c.id == id);
        if (categoryToDelete != undefined) setCategory(categoryToDelete);
        setDialogOpen(true);
    }

    const handleDialogClose = () => {
        setDialogOpen(false);
    }

    return (
        <Card
            sx={{
                ':hover': {
                    boxShadow: 10,
                },
                height: '48vh',
                display: 'flex',
                flexDirection: 'column'
            }}
            elevation={4}
        >
            <CardHeader title="Categories" />
            {loading ?
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    transform: 'translateY(200%)'
                }}>
                    <CircularProgress size={60} />
                </Box> :
                <CardContent>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >
                        <TextField variant="outlined" size="small"
                            sx={{
                                width: '14vw'
                            }}
                            inputRef={formValues}
                        />
                        <Button color="secondary"
                            sx={{
                                backgroundColor: 'primary.main',
                                color: 'secondary.main',
                                ':hover': {
                                    backgroundColor: 'secondary.main',
                                    color: 'primary.main'
                                }
                            }}
                            onClick={() => { handleAddClick() }}
                        >
                            Add
                        </Button>
                    </Box>
                    <TableContainer
                        sx={{
                            maxHeight: '35vh',
                            marginTop: '2vh'
                        }}
                    >
                        <Table size="small">
                            <TableBody>
                                {categories?.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell
                                            align="left"
                                            sx={{
                                                padding: 0
                                            }}
                                        >
                                            {category.title}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{
                                                padding: 0
                                            }}
                                        >
                                            <IconButton
                                                onClick={() => { handleEditClick(category.id) }}
                                                sx={{
                                                    ':hover': {
                                                        backgroundColor: 'transparent'
                                                    },
                                                    padding: '5px 3px'
                                                }}
                                            >
                                                <Edit
                                                    fontSize="small"
                                                    sx={{
                                                        ':hover': {
                                                            color: 'secondary.main'
                                                        }
                                                    }}
                                                />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => { handleDeleteClick(category.id) }}
                                                sx={{
                                                    ':hover': {
                                                        backgroundColor: 'transparent'
                                                    }
                                                }}
                                            >
                                                <Delete
                                                    fontSize="small"
                                                    sx={{
                                                        ':hover': {
                                                            color: 'secondary.main'
                                                        }
                                                    }}
                                                />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            }
            <CustomDialog
                isDelete={isDelete}
                isOpen={dialogOpen}
                handleDialogClose={handleDialogClose}
                categoryToManipulate={category}
            />
        </Card>
    )
}