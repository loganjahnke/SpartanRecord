import styled from "@emotion/styled";
import { Box, LinearProgress, linearProgressClasses, LinearProgressProps } from "@mui/material";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

export const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 10,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: ArrowheadTheme.background,
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
	}
}));

export function BeforeAfterProgress(props: LinearProgressProps)
{
	//`calc(${props.valueBuffer}% + 56px)`
	return (
		<>
			<BorderLinearProgress {...props} />
			{props.valueBuffer !== undefined && <Box sx={{ height: "24px", mb: "-24px", backgroundColor: "white", width: "2px", position: "relative", top: "-18px", left: `calc(${props.valueBuffer}%)` }} />}
		</>
	);
};


export const BorderLinearProgressMatches = styled(LinearProgress)(({ theme }) => ({
	height: 10,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: ArrowheadTheme.background,
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		backgroundColor: ArrowheadTheme.leftEarlyText,
	},
}));

export const CompareBarLeft = styled(LinearProgress)(({ theme }) => ({
	height: 15,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: ArrowheadTheme.background,
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 0,
		backgroundColor: ArrowheadTheme.eagle,
	},
}));

export const CompareBarRight = styled(LinearProgress)(({ theme }) => ({
	height: 15,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: ArrowheadTheme.background,
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 0,
		left: "100%",
		backgroundColor: ArrowheadTheme.cobra,
	},
}));