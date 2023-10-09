import { Box, Tooltip, Typography } from "@mui/material";
import { ArrowheadTheme } from "../../../Theme/ArrowheadTheme";
import { BeforeAfterProgress } from "../../Custom/BorderLinearProgress";
import { LeftvsRight } from "./LeftvsRight";

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Grow } from "../../Common/Grow";

export interface MatchBreakdownTemplateProps
{
	emphasize?: boolean;
	main: LeftvsRight;
	additional?: LeftvsRight[];
}

export function MatchBreakdown(props: MatchBreakdownTemplateProps)
{
	const { emphasize, main, additional } = props;

	const left = main.leftValue as number;
	const right = main.rightValue as number;
	const leftExpected = main.expectedLeft ?? -1;
	const rightExpected = main.expectedRight ?? -1;

	return (
		<Box sx={{ 
			display: "grid",
			width: "300px",
			alignItems: "center" }}>
			<Box sx={{ mb: 1 }}>
				<Box sx={{ display: "flex", flexDirection: "row", mb: 0.5 }}>
					<Box sx={{ width: "33%" }}>
						<Typography variant={"caption"} sx={{ fontSize: "0.8rem", ml: 1 }}>{main.leftDesc}</Typography>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Typography variant={emphasize ? "h4" : "body1"} sx={{ ml: 1 }}>{left.toLocaleString()}</Typography>
							{leftExpected !== -1 && <Box sx={{ ml: "2px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
								{left < leftExpected && <Typography sx={{ fontSize: "10px", mb: "-4px", mt: "4px" }}>{Math.round(left - leftExpected)}</Typography>}
								{left < leftExpected 
									? <KeyboardArrowDownIcon fontSize="small" sx={{ color: ArrowheadTheme.bad }} /> 
									: <KeyboardArrowUpIcon fontSize="small" sx={{ color: ArrowheadTheme.good }} />
								}
								{left >= leftExpected && <Typography sx={{ fontSize: "10px", mt: "-4px", mb: "2px" }}>+{Math.round(left - leftExpected)}</Typography>}
							</Box>}
						</Box>
					</Box>
					<Box sx={{ flexGrow: 1, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "flex-end", flexDirection: "column" }}>
						<Typography variant="caption">{main.middleDesc}</Typography>
						<Typography variant="body1">{main.middleValue?.toLocaleString()}</Typography>
					</Box>
					<Box sx={{ width: "33%", textAlign: "right" }}>
						<Typography variant={"caption"} sx={{ fontSize: "0.8rem", mr: 1 }}>{main.rightDesc}</Typography>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Grow />
							{rightExpected !== -1 && <Box sx={{ mr: "2px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
								{right < rightExpected && <Typography sx={{ fontSize: "10px", mb: "-4px", mt: "4px" }}>-{Math.round(rightExpected - right)}</Typography>}
								{right > rightExpected 
									? <KeyboardArrowUpIcon fontSize="small" sx={{ color: ArrowheadTheme.bad }} />
									: <KeyboardArrowDownIcon fontSize="small" sx={{ color: ArrowheadTheme.good }} /> 
								}
								{right >= rightExpected && <Typography sx={{ fontSize: "10px", mt: "-4px", mb: "2px" }}>+{Math.round(rightExpected - right) * -1}</Typography>}
							</Box>}
							<Typography variant={emphasize ? "h4" : "body1"} sx={{ mr: 1 }}>{right.toLocaleString()}</Typography>
						</Box>
					</Box>
				</Box>
				<Box>
					<BeforeAfterProgress 
						variant="determinate" 
						value={(left / (left + right)) * 100}
						valueBuffer={50}
						sx={{ 
							flexBasis: "75%", 
							ml: 1, 
							mr: 1,
							backgroundColor: ArrowheadTheme.bad + " !important",
							"> .MuiLinearProgress-bar": { background: ArrowheadTheme.good, borderRadius: "0 !important" }
						}} />
				</Box>
				{additional?.map((lvr, index) => lvr.leftValue !== -1 && <Box sx={{ display: "flex", flexDirection: "row", mt: index > 0 ? -0.5 : 0.5 }}>
						<Box sx={{ width: "33%", textAlign: "right", mr: 3 }}>
							<Typography variant="subtitle1">{lvr.leftValue} <Typography component="span" variant="subtitle1" sx={{ color: "#AAAAAA" }}>{lvr.leftDesc}</Typography></Typography>
						</Box>
						<Box sx={{ width: "34%", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
							<Tooltip title={lvr.middleTooltip} disableFocusListener arrow>
								<Typography variant="caption" sx={{ color: "#AAAAAA", textTransform: "uppercase", fontSize: "0.6rem" }}>{lvr.middleDesc}</Typography>
							</Tooltip>
							<Typography variant="body1">{lvr.middleValue?.toLocaleString()}</Typography>
						</Box>
						<Box sx={{ textAlign: "left", width: "33%", ml: 3 }}>
							<Typography variant="subtitle1">{lvr.rightValue} <Typography component="span" variant="subtitle1" sx={{ color: "#AAAAAA" }}>{lvr.rightDesc}</Typography></Typography>
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
}