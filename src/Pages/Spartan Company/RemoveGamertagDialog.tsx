import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { ArrowheadTheme } from "../../Assets/Theme/ArrowheadTheme";

interface RemoveGamertagDialogProps
{
	open: string;
	cancel: () => void;
	accept: () => void;
}

export function RemoveGamertagDialog(props: RemoveGamertagDialogProps)
{
	const { open, cancel, accept } = props;

	return (
		<Dialog open={!!open} onClose={cancel}>
			<DialogTitle sx={{ color: ArrowheadTheme.text_secondary }}>Remove {open}?</DialogTitle>
			<DialogContent>
				<DialogContentText variant="body2" sx={{ color: "primary.main" }}>
					Are you sure you want to remove {open} from your Spartan Company?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={cancel}>Cancel</Button>
				<Button onClick={accept} autoFocus>Remove</Button>
			</DialogActions>
		</Dialog>
	);
}