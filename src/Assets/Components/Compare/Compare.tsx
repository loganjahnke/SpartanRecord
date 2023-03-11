import { Box, Typography } from "@mui/material";
import { Grow } from "../Common/Grow";
import { CompareBar } from "./CompareBar";

export interface CompareProps
{
	category?: string;
	value1?: number;
	value2?: number;
	display1?: string;
	display2?: string;
	lessIsBetter?: boolean;
	isPercent?: boolean;
	background?: string;
	value1back?: string;
	value2back?: string;
}

export function Compare(props: CompareProps)
{
	const { category, value1 = 0, value2 = 0, display1, display2, isPercent } = props;

	return (
		<Box sx={{ p: 2 }}>
			<Box sx={{ width: "100%", display: "flex" }}>
				<Grow />
				<Typography variant="body2">{category}</Typography>
				<Grow />
			</Box>
			<Box sx={{ width: "100%", display: "flex" }}>
				<Typography variant="h5" sx={{ textAlign: "right", width: "calc(50% - 16px)", pr: 2 }}>{display1 ?? (Math.round(value1 * 100) / 100).toLocaleString()}{isPercent ? "%" : ""}</Typography>
				<Typography variant="h5" sx={{ textAlign: "left", width: "calc(50% - 16px)", pl: 2 }}>{display2 ?? (Math.round(value2 * 100) / 100).toLocaleString()}{isPercent ? "%" : ""}</Typography>
			</Box>
			<CompareBar {...props} />
		</Box>
	);
}