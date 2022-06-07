import styled from "@emotion/styled";
import { LinearProgress, linearProgressClasses } from "@mui/material";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

export const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 10,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: ArrowheadTheme.background,
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
	},
}));

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