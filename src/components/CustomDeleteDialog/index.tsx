import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"

interface Props {
    confirmDialog: {isOpen: boolean, title: string, onConfirm: () => void;};
    setConfirmDialog: React.Dispatch<React.SetStateAction<{
        isOpen: boolean;
        title: string;
        onConfirm: () => void;
    }>>;
}

export const CustomDeleteDialog: React.FC<Props> = ({
    confirmDialog,
    setConfirmDialog
}) => {
    return (
        <Dialog open={confirmDialog.isOpen}>
            <DialogTitle>
                {`Delete ${confirmDialog.title}`}
            </DialogTitle>
            <DialogContent>
                {`Are you sure to delete this ${confirmDialog.title} ?`}
            </DialogContent>
            <DialogActions>
                <Button onClick={confirmDialog.onConfirm}>OK</Button>
                <Button onClick={() => setConfirmDialog({...confirmDialog, isOpen: false})}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}