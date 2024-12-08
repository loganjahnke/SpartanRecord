import { Box, Button, Typography } from "@mui/material";

interface ErrorMessageProps
{
	primaryMessage: string;
	secondaryMessage?: string;
	actionCaption: string;
	action: () => void;
}

/**
 * A component to wrap text around a zoom animation
 */
export function ErrorMessage(props: ErrorMessageProps)
{
	const { primaryMessage, secondaryMessage, actionCaption, action } = props;

	return (
		<Box sx={{ m: 10, color: "primary.main" }}>
			<Typography variant="h3">{primaryMessage}</Typography>
			{secondaryMessage && <Typography variant="h6">{secondaryMessage}</Typography>}
			<Button sx={{ mt: 4 }} onClick={action} variant="contained">{actionCaption}</Button>
		</Box>
	);
}