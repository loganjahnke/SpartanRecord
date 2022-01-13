import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

export class ArrowheadError
{
    /** Error code that specifies that authentication failed for some reason */
    public static AuthenticationErrorCode = 29840;
    /** Error code that specifies that profile update failed */
    public static ProfileUpdateErrorCode = 30016;

    public static Dialog(props: { open: boolean, title: string, message: string, handleClose: any })
    {
        const { open, title, message, handleClose } = props;
        
        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>Okay</Button>
                </DialogActions>
            </Dialog>
        );
    }
}