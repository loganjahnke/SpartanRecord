import { Backdrop, CircularProgress } from "@mui/material";

export function AHLoading(props: { loadingMessage: string })
{
	const { loadingMessage } = props;
	
	return (
		<Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={!!loadingMessage}>
			<CircularProgress color="inherit" />
			<div className="loadingMessage">{loadingMessage}</div>
		</Backdrop>
	);
}