import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, TextFieldProps } from "@mui/material"
import { useRef } from "react";
import { toast } from "react-toastify";
import { Category, CategoryFormValues } from "../models/category";
import { Tag, TagFormValues } from "../models/tag";
import { useAppDispatch, useSelector } from "../redux/hooks";
import { deleteCategoryAsync, editCategoryAsync } from "../redux/slices/categorySlice";
import { deleteTagAsync, editTagAsync } from "../redux/slices/tagSlice";

interface Props {
    isDelete: boolean;
    isOpen: boolean;
    handleDialogClose: () => void;
    categoryToManipulate?: Category | any;
    tagToManipulate?: Tag | any;
}


export const CustomDialog: React.FC<Props> = ({
    isDelete,
    isOpen,
    handleDialogClose,
    categoryToManipulate,
    tagToManipulate
}) => {

    const dispatch = useAppDispatch();
    const formValues = useRef<TextFieldProps>(null);
    const { categories } = useSelector(state => state.category);
    const { tags } = useSelector(state => state.tag);

    const categoryText = {
        editTitle: "Edit Category",
        textfield: <TextField defaultValue={categoryToManipulate?.title} inputRef={formValues} required />,
        deleteTitle: "Delete Category",
        deleteText: "Are you sure you want to delete this category?"
    }

    const tagText = {
        editTitle: "Edit Tag",
        textfield: <TextField defaultValue={tagToManipulate?.title} inputRef={formValues} required />,
        deleteTitle: "Delete Tag",
        deleteText: "Are you sure you want to delete this tag?"
    }

    const handleConfirmClick = async () => {
        if (categoryToManipulate && isDelete) {

            dispatch(deleteCategoryAsync(categoryToManipulate.id));

        } else if (categoryToManipulate && !isDelete) {
            // handle category edit

            // validate for null input
            const formValuesAsString = formValues.current?.value as string;
            if (formValuesAsString.trim() === '') {
                toast.error("Title cannot be empty");
                return;
            }
            // validate for duplicate category name
            const sameCategory = categories?.filter(item => item.title === formValuesAsString);
            if (sameCategory?.length) {
                toast.error("Category with the same name already exists");
                return;
            }
            const newCategoryData: CategoryFormValues = {
                id: categoryToManipulate.id,
                title: formValues.current?.value as string
            }
            dispatch(editCategoryAsync(newCategoryData));
        }

        if (tagToManipulate && isDelete) {
            // handle tag delete
            dispatch(deleteTagAsync(tagToManipulate.id));

        } else if (tagToManipulate && !isDelete) {
            // handle tag edit

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
            const newTagData: TagFormValues = {
                id: tagToManipulate.id,
                title: formValues.current?.value as string
            }
            dispatch(editTagAsync(newTagData));
        }
        handleDialogClose();
    }

    const handleCancelClick = () => {
        handleDialogClose();
    }

    return (
        <Dialog open={isOpen}>
            <DialogTitle>
                {
                    tagToManipulate && isDelete ?
                        tagText.deleteTitle :
                        tagToManipulate && !isDelete ?
                            tagText.editTitle :
                            categoryToManipulate && isDelete ?
                                categoryText.deleteTitle :
                                categoryText.editTitle
                }
            </DialogTitle>
            <DialogContent>
                {
                    tagToManipulate && isDelete ?
                        tagText.deleteText :
                        tagToManipulate && !isDelete ?
                            tagText.textfield :
                            categoryToManipulate && isDelete ?
                                categoryText.deleteText :
                                categoryText.textfield
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleConfirmClick}>OK</Button>
                <Button onClick={handleCancelClick}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )

}