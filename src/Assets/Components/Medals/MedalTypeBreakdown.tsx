import { Box, Typography } from "@mui/material";
import { AllMedals } from "../../../Objects/Helpers/AllMedals";
import { Medal, MedalType } from "../../../Objects/Pieces/Medal";
import { AHCircularProgress } from "../Custom/AHCircularProgress";
import { MedalTile } from "./MedalTile";

interface MedalTypeBreakdownProps
{
	type?: MedalType;
	medals: Medal[];
	showAll?: boolean;
	select?: (id: number) => void;
	selectedID?: number;
}

export function MedalTypeBreakdown(props: MedalTypeBreakdownProps)
{
	const { type, medals, showAll, select, selectedID } = props;

	const filtered = type ? medals.filter(medal => medal.type === type) : [];
	const all = Object.values(AllMedals)
		.map((medalJSON: any) => new Medal(medalJSON))
		.filter(medal => medal.type === type && (filtered.length > 0 ? !filtered.map(filter => filter.name).includes(medal.name) : true))
		.sort((a, b) => a.CompareTo(b));
	const current = filtered.length;
	const total = all.length + current;

	return (
		!select 
			? 
			<Box sx={{ backgroundColor: "divider", borderRadius: 3 }}>
				<Box sx={{ 
					display: "flex", 
					flexDirection: "column", 
					justifyContent: "center", 
					alignItems: "center", 
					clear: "both" }}>
					<Box sx={{ borderRadius: "12px 12px 0 0", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%", pt: 2, pb: 2, backgroundColor: "secondary.main" }}>
						<Box sx={{ ml: 1 }} />
						<Box sx={{ width: "40px" }} />
						<Box sx={{ flexGrow: 1 }} />
						<Typography variant="h5">{type}</Typography>
						<Box sx={{ flexGrow: 1 }} />
						<AHCircularProgress value={current/total * 100} current={current} total={total} />
						<Box sx={{ mr: 1 }} />
					</Box>
					<Box sx={{width: !select ? "100%" : "48px" }}>
						{filtered.length > 0 
							? filtered.sort((a, b) => a.CompareTo(b)).map(medal => <MedalTile medal={medal} />) 
							: <Typography variant="body1" sx={{ mt: 4, mb: 4, width: "100%", textAlign: "center" }}>No medals earned.</Typography>}
					</Box>
					{showAll && <Box sx={{width: "100%" }}>
						{all.map(medal => <MedalTile medal={medal} />)}
					</Box>}
				</Box>
			</Box>
			:
			<Box sx={{ backgroundColor: "divider", borderRadius: 3 }}>
				<Box sx={{ 
					display: "flex", 
					flexDirection: "row", 
					justifyContent: "space-evenly", 
					alignItems: "center", 
					clear: "both" }}>
					<Box sx={{width: "100%" }}>
						{Object.keys(AllMedals)
							.map((id: string) => new Medal((AllMedals as any)[id], +id))
							.sort((a, b) => a.CompareTo(b))
							.map(medal => <MedalTile medal={medal} select={select} selectedID={selectedID} disabled={medals.findIndex(m => m.id === medal.id) === -1} />)}
					</Box>
				</Box>
			</Box>
	);
}