import styled from "@emotion/styled";
import { Box, Typography, Tooltip, TooltipProps, tooltipClasses } from "@mui/material";
import { Rank } from "../../../Objects/Model/CSRS";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { BeforeAfterProgress } from "../Custom/BorderLinearProgress";

export const CSRSTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
	  maxWidth: 350,
	  backgroundColor: ArrowheadTheme.secondary,
	  margin: 0
	},
}));


export function CSRSProgression(props: { pre: Rank, post: Rank, noBackground?: boolean })
{
	const { pre, post, noBackground } = props;

    const background = noBackground ? "" : ArrowheadTheme.secondary;
	const progress = post.tier === "Unranked" ? (5 - post.measurementMatchesRemaining) * 20
		: post.tier === "Onyx" ? 100 : (post.value - post.tierStart) * 100 / (post.nextTierStart - post.tierStart);
	const buffer = post.tier === "Onyx" || post.subTier !== pre.subTier ? undefined 
		: pre.tier === "Unranked" ? (5 - pre.measurementMatchesRemaining) * 20
		: (pre.value - pre.tierStart) * 100 / (pre.nextTierStart - pre.tierStart);

	return (
		<Box sx={{ 
			background: background, 
			display: "grid",
			gridTemplateColumns: "48px 250px",
			alignItems: "center",
			width: noBackground ? "auto" : "100%" }}>
			<img src={post.tierImageUrl} alt="Tier" height="48px" width="48px" />
			<Box sx={{ mb: 1 }}>
				<Box sx={{ display: "flex", flexDirection: "row", mb: 0.5 }}>
					<Typography variant={"subtitle1"} sx={{ fontSize: "0.8rem", ml: 1 }}>{post.GetTitle()}</Typography>
					<Box sx={{ flexGrow: 1 }} />
					{post.tier === "Unranked" ?
						<Typography variant={"caption"} sx={{ fontSize: "0.8rem", mr: 1, textAlign: "right" }}>{post.measurementMatchesRemaining + " matches remaining"}</Typography>
					:
						<Typography variant={"subtitle1"} sx={{ pl: "8px", pr: "8px", borderRadius: "8px", fontSize: "0.8rem", mr: 1, textAlign: "right", backgroundColor: post.value - pre.value < 0 ? ArrowheadTheme.bad : ArrowheadTheme.good }}>{(post.value - pre.value < 0 ? "" : "+") + (post.value - pre.value)}</Typography>
					}
				</Box>
				<Box>
					<BeforeAfterProgress 
						variant="determinate" 
						value={progress} 
						valueBuffer={buffer}
						sx={{ 
							flexBasis: "75%", 
							ml: 1, 
							mr: 1,
							outline: post.GetOutline(),
							"> .MuiLinearProgress-bar": { background: post.GetBackground() }
						}} />
				</Box>
			</Box>
		</Box>
	);
}