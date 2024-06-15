import { Box, Typography } from "@mui/material";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { BorderLinearProgress } from "../Custom/BorderLinearProgress";
import { CareerRankSchema } from "../../../Database/Schemas/CareerRankSchema";
import { CurrentGrade, GetCareerRankMetadata, NextGrade } from "../../../Objects/Helpers/AllCareerRanks";
import { URLReducer } from "../../../Objects/Helpers/Statics/URLReducer";

export function CareerRankTile(props: { rank?: CareerRankSchema, rightAlign?: boolean })
{
	const { rank, rightAlign } = props;

    const background = ArrowheadTheme.box;
	const previous = GetCareerRankMetadata((rank?.data?.current?.rank ?? 1) - 1);

	if (!previous) { return <></>; }
	if (!rank?.data?.level) { return <></>; }

	const levelAmount = (rank.data.current.properties.threshold - previous.properties.threshold);
	const progress = rank.data.current.title === "Hero" ? 100 : (levelAmount - rank.data.level.remaining_xp_to_next_level) * 100 / levelAmount;
	const color = rank.data.current.title === "Hero" ? "Hero" : (rank.data.current.properties.type || rank.data.current.title);

	return (
		<Box sx={{ 
			background: background, 
			display: "grid",
			gridTemplateColumns: rightAlign ? "auto 48px" : "48px auto",
			margin: 0.5, 
			alignItems: "center",
			padding: 0.5,
			width: "100%" }}>
			{!rightAlign && <Box sx={{ display: "flex", alignItems: "center" }}><img src={URLReducer.ConstructURLForGruntAPI(rank.data.current.image_urls.icon)} alt="Rank" height="48px" /></Box>}
			<Box sx={{ mb: 1 }}>
				<Box sx={{ display: "flex", flexDirection: "row", mb: 0.5, alignItems: "center" }}>
					<Typography variant="subtitle1" sx={{ fontSize: "0.8rem", ml: 1 }}>{rank.data.current.title} {CurrentGrade(rank)}</Typography>
					<Box sx={{ ml: 1 }} />
					<Box sx={{ flexGrow: 1 }} />
					{color !== "Hero" && rank.data.next && <Typography variant="caption" sx={{ display: "block", fontSize: "0.8rem", mr: 1 }}>{rank.data.next.title} {NextGrade(rank)}</Typography>}
				</Box>
				<Box>
					<BorderLinearProgress 
						variant="determinate" 
						value={progress} 
						sx={{ 
							flexBasis: "75%", 
							ml: 1, 
							mr: 1, 
							outline: color === "Onyx" ? "1px solid #5E3D19 !important" : "",
							"> .MuiLinearProgress-bar": 
								color === "Bronze" 
									? { background: "linear-gradient(to right, #a16447 0%, #a16447 20%, #633522 50%, #7e462e 80%, #7e462e 100%)" } :
								color === "Silver" 
									? { background: "linear-gradient(to right, #d3d3d3 0%, #d3d3d3 20%, #a6a6a6 50%, #b8b8b8 80%, #b8b8b8 100%)" } :
								color === "Gold" 
									? { background: "linear-gradient(to right, #b9aa57 0%, #b9aa57 20%, #583e1b 50%, #a2854e 80%, #a2854e 100%)" } :
								color === "Platinum"
									? { background: "linear-gradient(to right, #8e93cc 0%, #8e93cc 20%, #c1d0d0 50%, #5a6276 80%, #5a6276 100%)" } :
								color === "Diamond" 
									? { background: "linear-gradient(to right, #88c6f9 0%, #88c6f9 20%, #58beed 50%, #5078c0 80%, #5078c0 100%)" } :
								color === "Onyx" || color === "Hero"
									? { background: "linear-gradient(to left, #bb8c41 0%, #bb8c41 20%, #8c6e34 50%, #ffffba 80%, #ffffba 100%)" }
								/* Unranked */ 
									: { background: "linear-gradient(to left, #FFFFFF 0%, #ffffda 20%, #EFEFEF 50%, #ffffda 80%, #FCFCFC 100%)" } 
						}} />
				</Box>
				<Box sx={{ display: "flex", flexDirection: "row", mt: 0.5, alignItems: "center" }}>
					<Typography variant="caption" sx={{ fontSize: "0.8rem", ml: 1 }}>Total: {rank.data.level.total_xp.toLocaleString()} XP</Typography>
					<Box sx={{ ml: 1 }} />
					<Box sx={{ flexGrow: 1 }} />
					{color !== "Hero" && rank.data.next && <Typography variant="caption" sx={{ display: "block", fontSize: "0.8rem", mr: 1 }}>{`${rank.data.level.remaining_xp_to_next_level.toLocaleString()} XP needed for next rank`}</Typography>}
				</Box>
			</Box>
			{rightAlign && <Box sx={{ display: "flex", alignItems: "center", justifySelf: "right" }}><img src={URLReducer.ConstructURLForGruntAPI(rank.data.current.image_urls.icon)} alt="Rank" height="48px" /></Box>}
		</Box>
	);
}