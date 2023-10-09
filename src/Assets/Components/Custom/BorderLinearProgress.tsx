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
			{props.valueBuffer !== undefined && <Box sx={{ height: "10px", mb: "-10px", backgroundColor: "#DFDFDF", width: "2px", position: "relative", top: "-10px", left: `calc(${props.valueBuffer}% - 1px)` }} />}
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

export function CompareBarLeft(props: LinearProgressProps)
{
	return <>
		<CompareBarLeftProgress {...props} />
		{props.valueBuffer !== undefined && <Box sx={{ height: "15px", mb: "-15px", backgroundColor: "#DFDFDF", width: "2px", position: "relative", top: "-15px", left: `calc(${props.valueBuffer}% - 1px)` }} />}
	</>;
}

const CompareBarLeftProgress = styled(LinearProgress)(({ theme }) => ({
	height: 15,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: ArrowheadTheme.background,
		boxShadow: "0 0 15px " + ArrowheadTheme.thin_border
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 0,
		backgroundColor: ArrowheadTheme.eagle,
	},
}));

export function CompareBarRight(props: LinearProgressProps)
{
	return <>
		<CompareBarRightProgress {...props} />
		{props.valueBuffer !== undefined && <Box sx={{ height: "15px", mb: "-15px", backgroundColor: "#DFDFDF", width: "2px", position: "relative", top: "-15px", left: `calc(${props.valueBuffer}% - 1px)` }} />}
	</>;
}

const CompareBarRightProgress = styled(LinearProgress)(({ theme }) => ({
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