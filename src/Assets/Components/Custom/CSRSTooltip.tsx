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


export function CSRSProgression(props: { pre: Rank, post: Rank })
{
	const { pre, post } = props;

    const background = ArrowheadTheme.secondary;
	const progress = post.tier === "Unranked" ? (10 - post.measurementMatchesRemaining) * 10
		: post.tier === "Onyx" ? 100 : (post.value - post.tierStart) * 100 / (post.nextTierStart - post.tierStart);
	const buffer = post.tier === "Onyx" || post.subTier !== pre.subTier ? undefined 
		: pre.tier === "Unranked" ? (10 - pre.measurementMatchesRemaining) * 10
		: (pre.value - pre.tierStart) * 100 / (pre.nextTierStart - pre.tierStart);

	return (
		<Box sx={{ 
			background: background, 
			display: "grid",
			gridTemplateColumns: "48px 250px",
			alignItems: "center",
			width: "100%" }}>
			<img src={post.tierImageUrl} alt="Tier" height="48px" width="48px" />
			<Box sx={{ mb: 1 }}>
				<Box sx={{ display: "flex", flexDirection: "row", mb: 0.5 }}>
					<Typography variant={"subtitle1"} sx={{ fontSize: "0.8rem", ml: 1 }}>{post.GetTitle()}</Typography>
					<Box sx={{ flexGrow: 1 }} />
					{post.tier === "Unranked" ?
						<Typography variant={"caption"} sx={{ fontSize: "0.8rem", mr: 1, textAlign: "right" }}>{10 - post.measurementMatchesRemaining + " matches remaining"}</Typography>
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
							outline: post.tier === "Onyx" ? "1px solid #5E3D19 !important" : "",
							"> .MuiLinearProgress-bar": 
								post.tier === "Bronze" 
									? { background: "linear-gradient(to right, #a16447 0%, #a16447 20%, #633522 50%, #7e462e 80%, #7e462e 100%)" } :
								post.tier === "Silver" 
									? { background: "linear-gradient(to right, #d3d3d3 0%, #d3d3d3 20%, #a6a6a6 50%, #b8b8b8 80%, #b8b8b8 100%)" } :
								post.tier === "Gold" 
									? { background: "linear-gradient(to right, #b9aa57 0%, #b9aa57 20%, #583e1b 50%, #a2854e 80%, #a2854e 100%)" } :
								post.tier === "Platinum" 
									? { background: "linear-gradient(to right, #8e93cc 0%, #8e93cc 20%, #c1d0d0 50%, #5a6276 80%, #5a6276 100%)" } :
								post.tier === "Diamond" 
									? { background: "linear-gradient(to right, #88c6f9 0%, #88c6f9 20%, #58beed 50%, #5078c0 80%, #5078c0 100%)" } :
								post.tier === "Onyx" 
									? { background: "linear-gradient(to left, #bb8c41 0%, #bb8c41 20%, #8c6e34 50%, #ffffba 80%, #ffffba 100%)" }
								/* Unranked */ 
									: { background: "#FFFFFF" } 
						}} />
				</Box>
			</Box>
		</Box>
	);
}