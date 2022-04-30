import { Box, Typography } from "@mui/material";
import { AllMedals } from "../../../Objects/Helpers/AllMedals";
import { Medal, MedalType } from "../../../Objects/Pieces/Medal";
import { MedalTile } from "./MedalTile";
import { UnearnedMedalTile } from "./UnearnedMedalTile";

interface MedalTypeBreakdownProps
{
	type: MedalType;
	medals: Medal[];
	showAll: boolean;
}

export function MedalTypeBreakdown(props: MedalTypeBreakdownProps)
{
	const { type, medals, showAll } = props;

	const filtered = medals.filter(medal => medal.type === type);

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3 }}>
			<Box sx={{ 
				display: "flex", 
				flexDirection: "column", 
				justifyContent: "center", 
				alignItems: "center", 
				clear: "both" }}>
				<Box sx={{ borderRadius: "12px 12px 0 0", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%", pt: 2, pb: 2, backgroundColor: "secondary.main" }}>
					<Typography variant="h5">{type}</Typography>
				</Box>
				<Box sx={{ 
					display: "grid", 
					gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
					width: "100%" }}>
					{filtered.length > 0 
						? filtered.map(medal => <MedalTile medal={medal} />) 
						: <Typography variant="body1" sx={{ mt: 4, mb: 4, width: "100%", textAlign: "center" }}>No medals earned.</Typography>}
				</Box>
				{showAll 
					?  <Box sx={{ backgroundColor: "secondary.main", borderRadius:3, m: 2, display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly", alignItems: "center" }}>
							{Object.values(AllMedals)
								.map((medalJSON: any) => new Medal(medalJSON))
								.filter(medal => medal.type === type && (filtered.length > 0 ? !filtered.map(filter => filter.name).includes(medal.name) : true))
								.sort((a, b) => a.sort > b.sort ? 1 : -1)
								.map(medal => <UnearnedMedalTile medal={medal} />)}
						</Box>
					: undefined}
			</Box>
		</Box>
	);
}