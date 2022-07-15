import { Box, Typography } from "@mui/material";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

interface LabelValueProps
{
	label: string;
    value?: string | number;
}

export function LabelValue(props: LabelValueProps)
{
	const { label, value } = props;

	return (
        <Box sx={{ display: "flex", flexDirection: "column", m: 2 }}>
			<Typography sx={{ color: ArrowheadTheme.label, fontWeight: 200, fontSize: "0.75rem" }}>{label}</Typography>
			<Typography variant="body1">{value === undefined ? "\u2014" : value.toLocaleString()}</Typography>
        </Box>
	);
}