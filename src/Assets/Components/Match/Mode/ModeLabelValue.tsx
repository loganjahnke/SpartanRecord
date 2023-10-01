import { Box, Typography } from "@mui/material";

interface ModeLabelValueProps
{
	label: string;
	value?: number;
	time?: string;
}

export function ModeLabelValue(props: ModeLabelValueProps)
{
	return <Box sx={{ display: "flex", justifyContent: "center" }}>
		<Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
			<Typography variant="caption" sx={{ color: "#AAAAAA", width: "50%", textAlign: "right", mr: 1.5, textTransform: "uppercase", fontSize: "0.6rem" }}>{props.label}:</Typography>
			{props.value !== undefined && <Typography variant="body1">{props.value.toLocaleString()}</Typography>}
			{props.time !== undefined && <Typography variant="body1">{props.time}</Typography>}
		</Box>
	</Box>;
}

export function VerticalModeLabelValue(props: ModeLabelValueProps)
{
	return <Box sx={{ display: "flex", justifyContent: "center", textAlign: "center", m: 2 }}>
		<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
			<Typography variant="caption" sx={{ color: "#AAAAAA", textTransform: "uppercase", fontSize: "0.6rem" }}>{props.label}</Typography>
			{props.value !== undefined && <Typography variant="body1">{props.value.toLocaleString()}</Typography>}
			{props.time !== undefined && <Typography variant="body1">{props.time}</Typography>}
		</Box>
	</Box>;
}