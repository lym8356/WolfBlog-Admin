import { Delete, Info } from "@mui/icons-material"
import {
    Box, Button, Card,
    CardContent, CardHeader, CircularProgress,
    IconButton, List, ListItem,
    ListItemText, TextField, TextFieldProps,
    Tooltip
} from "@mui/material"
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Tag, TagFormValues } from "../../models/tag"
import { useAppDispatch, useSelector } from "../../redux/hooks";
import { createTagAsync } from "../../redux/slices/tagSlice";
import { CustomDialog } from "../../utils/CustomDialog";

interface Props {
    tags: Tag[] | null;
}

export const TagBox: React.FC<Props> = ({ tags }) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [tag, setTag] = useState({});

    const { loading } = useSelector(state => state.tag);
    const dispatch = useAppDispatch();
    const formValues = useRef<TextFieldProps>(null);

    const handleAddClick = () => {
        // validate for null input
        const formValuesAsString = formValues.current?.value as string;
        if (formValuesAsString.trim() === '') {
            toast.error("Title cannot be empty");
            return;
        }
        // validate for duplicate category name
        const sameTag = tags?.filter(item => item.title === formValuesAsString);
        if (sameTag?.length) {
            toast.error("Tag with the same name already exists");
            return;
        }

        const newTag: TagFormValues = {
            title: formValues.current?.value as string
        }
        dispatch(createTagAsync(newTag));
    }

    const handleEditClick = (id: number) => {
        setIsDelete(false);
        // process logic then
        const tagToEdit = tags?.find(t => t.id == id);
        if (tagToEdit != undefined) setTag(tagToEdit);
        setDialogOpen(true);
    }

    const handleDeleteClick = (id: number) => {
        setIsDelete(true);
        // process logic then
        const tagToEdit = tags?.find(t => t.id == id);
        if (tagToEdit != undefined) setTag(tagToEdit);
        setDialogOpen(true);
    }

    const handleDialogClose = () => {
        setDialogOpen(false);
    }

    return (
        <Card
            sx={{
                ':hover': {
                    boxShadow: 10
                },
                height: '48vh'
            }}
            elevation={4}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <CardHeader title="Tags"
                    sx={{
                        display: 'inline-block',
                        '&.MuiCardHeader-root': {
                            paddingRight: 0
                        }
                    }}
                />
                <Tooltip title="Double click a tag to edit"
                    placement="left"
                    arrow
                    sx={{
                        marginRight: '10px'
                    }}
                >
                    <Info fontSize="large" />
                </Tooltip>
            </Box>
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
                            justifyContent: 'space-between',
                        }}
                        marginBottom={3}
                    >
                        <TextField variant="outlined" size="small"
                            sx={{
                                width: '14vw'
                            }}
                            inputRef={formValues}
                        />
                        <Button color="secondary"
                            onClick={() => { handleAddClick() }}
                            sx={{
                                backgroundColor: 'primary.main',
                                color: 'secondary.main',
                                ':hover': {
                                    backgroundColor: 'secondary.light',
                                    color: 'primary.main'
                                }
                            }}
                        >
                            Add
                        </Button>
                    </Box>
                    <List
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start',
                            alignItems: 'center'
                        }}
                    >
                        {tags?.map((tag) => (
                            <ListItem
                                key={tag.id}
                                onDoubleClick={() => handleEditClick(tag.id)}
                                sx={{
                                    width: 'fit-content',
                                    margin: '0 0 10px 10px',
                                    padding: '0 10px',
                                    transition: 'all 0.2s',
                                    ':hover': {
                                        boxShadow: '0 0 8px rgba(0,0,0,0.6)',
                                        transform: 'scale(1.1)'
                                    },
                                    userSelect: 'none',
                                    backgroundColor: 'primary.main',
                                    color: 'secondary.main'
                                }}
                            >
                                <ListItemText
                                    primary={tag.title}
                                    primaryTypographyProps={{ fontSize: "14px", color: 'secondary.light' }}
                                />
                                <IconButton
                                    onClick={() => { handleDeleteClick(tag.id) }}
                                    sx={{
                                        ':hover': {
                                            backgroundColor: 'transparent'
                                        },
                                        paddingRight: '0'
                                    }}
                                >
                                    <Delete fontSize="small"
                                        sx={{
                                            color: 'secondary.light',
                                            ':hover': {
                                                color: 'secondary.main'
                                            }
                                        }}
                                    />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            }
            <CustomDialog
                isDelete={isDelete}
                isOpen={dialogOpen}
                handleDialogClose={handleDialogClose}
                tagToManipulate={tag}
            />
        </Card>
    )
}