import { Box, Typography } from "@mui/material";
import { ArrowheadTheme } from "../../../Theme/ArrowheadTheme";
import { BeforeAfterProgress } from "../../Custom/BorderLinearProgress";

export interface MatchBreakdownTemplateProps
{
	label1: string;
	value1: number;
	label2: string;
	value2: number;
}

export function MatchBreakdown(props: MatchBreakdownTemplateProps)
{
	const { label1, value1, label2, value2 } = props;

	return (
		<Box sx={{ 
			display: "grid",
			width: "300px",
			alignItems: "center" }}>
			<Box sx={{ mb: 1 }}>
				<Box sx={{ display: "flex", flexDirection: "row", mb: 0.5 }}>
					<Box>
						<Typography variant={"caption"} sx={{ fontSize: "0.8rem", ml: 1 }}>{label1}</Typography>
						<Typography variant={"body1"} sx={{ ml: 1 }}>{value1.toLocaleString()}</Typography>
					</Box>
					<Box sx={{ flexGrow: 1 }} />
					<Box sx={{ textAlign: "right" }}>
						<Typography variant={"caption"} sx={{ fontSize: "0.8rem", mr: 1 }}>{label2}</Typography>
						<Typography variant={"body1"} sx={{ mr: 1 }}>{value2.toLocaleString()}</Typography>
					</Box>
				</Box>
				<Box>
					<BeforeAfterProgress 
						variant="determinate" 
						value={(value1 / (value1 + value2)) * 100}
						valueBuffer={50}
						sx={{ 
							flexBasis: "75%", 
							ml: 1, 
							mr: 1,
							backgroundColor: ArrowheadTheme.bad + " !important",
							"> .MuiLinearProgress-bar": { background: ArrowheadTheme.good }
						}} />
				</Box>
			</Box>
		</Box>
	);
}