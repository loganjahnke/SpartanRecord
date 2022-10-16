import { Check } from "@mui/icons-material";
import { CircularProgressProps, Box, CircularProgress, Typography } from "@mui/material";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

export function AHCircularProgress(
	props: CircularProgressProps & { current: number, total: number },
  ) {
	const complete = props.value !== undefined && props.value >= 100;
	return (
		<Box sx={{ position: 'relative', display: 'inline-flex' }}>
			<CircularProgress variant="determinate" {...props} color={complete ? "success" : "primary"} />
			<Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", background: complete ? ArrowheadTheme.good : "", borderRadius: "50%" }}>
				{complete ? <Check color="primary" /> : <Typography variant="caption" component="div" color="text.secondary">{`${props.total - props.current}`}</Typography>}
			</Box>
	  	</Box>
	);
  }