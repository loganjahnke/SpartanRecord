import { Box, Tooltip, Typography } from "@mui/material";
import { CSRS } from "../../../Objects/Model/CSRS";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { BorderLinearProgress } from "../Custom/BorderLinearProgress";

export function CSRSBreakdownTile(props: { csrs: CSRS })
{
	const { csrs } = props;

    const background = ArrowheadTheme.box;
	const progress = csrs.ranks.current.tier === "Unranked" ? (5 - csrs.ranks.current.measurementMatchesRemaining) * 20
		: csrs.ranks.current.tier === "Onyx" ? 100 : (csrs.ranks.current.value - csrs.ranks.current.tierStart) * 100 / (csrs.ranks.current.nextTierStart - csrs.ranks.current.tierStart);

	return (
		<Box sx={{ 
			background: background, 
			display: "grid",
			gridTemplateColumns: "48px auto",
			margin: 0.5, 
			alignItems: "center",
			padding: 0.5,
			width: "100%" }}>
			<img src={csrs.ranks.current.tierImageUrl} alt="Tier" height="48px" width="48px" />
			<Box sx={{ mb: 1 }}>
				<Box sx={{ display: "flex", flexDirection: "row", mb: 0.5, alignItems: "center" }}>
					<Typography variant={"subtitle1"} sx={{ fontSize: "0.8rem", ml: 1 }}>{csrs.GetHeader()}</Typography>
					<Box sx={{ ml: 1 }} />
					{csrs.GetHeaderIcon()}
					<Box sx={{ flexGrow: 1 }} />
					<Typography variant="caption" sx={{ display: "block", fontSize: "0.8rem", mr: 1 }}>{csrs.GetSubtitle()}</Typography>
				</Box>
				<Box>
					<Tooltip disableFocusListener arrow title={
						csrs.ranks.current.tier === "Unranked" 
							? `${csrs.ranks.current.measurementMatchesRemaining} placement matches remaining` :
						csrs.ranks.current.tier === "Onyx"
							? "You are at the maximum rank!"
						/* Anything else */ 
							: `${csrs.ranks.current.nextTierStart - csrs.ranks.current.value} needed for next tier`}>
						<BorderLinearProgress 
							variant="determinate" 
							value={progress} 
							sx={{ 
								flexBasis: "75%", 
								ml: 1, 
								mr: 1, 
								outline: csrs.ranks.current.tier === "Onyx" ? "1px solid #5E3D19 !important" : "",
								"> .MuiLinearProgress-bar": 
									csrs.ranks.current.tier === "Bronze" 
										? { background: "linear-gradient(to right, #a16447 0%, #a16447 20%, #633522 50%, #7e462e 80%, #7e462e 100%)" } :
									csrs.ranks.current.tier === "Silver" 
										? { background: "linear-gradient(to right, #d3d3d3 0%, #d3d3d3 20%, #a6a6a6 50%, #b8b8b8 80%, #b8b8b8 100%)" } :
									csrs.ranks.current.tier === "Gold" 
										? { background: "linear-gradient(to right, #b9aa57 0%, #b9aa57 20%, #583e1b 50%, #a2854e 80%, #a2854e 100%)" } :
									csrs.ranks.current.tier === "Platinum" 
										? { background: "linear-gradient(to right, #8e93cc 0%, #8e93cc 20%, #c1d0d0 50%, #5a6276 80%, #5a6276 100%)" } :
									csrs.ranks.current.tier === "Diamond" 
										? { background: "linear-gradient(to right, #88c6f9 0%, #88c6f9 20%, #58beed 50%, #5078c0 80%, #5078c0 100%)" } :
									csrs.ranks.current.tier === "Onyx" 
										? { background: "linear-gradient(to left, #bb8c41 0%, #bb8c41 20%, #8c6e34 50%, #ffffba 80%, #ffffba 100%)" }
									/* Unranked */ 
										: { background: "linear-gradient(to left, #FFFFFF 0%, #ffffda 20%, #EFEFEF 50%, #ffffda 80%, #FCFCFC 100%)" } 
							}} />
					</Tooltip>
				</Box>
			</Box>
		</Box>
	);
}