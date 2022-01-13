import { Box } from "@mui/material";
import { SpartanCompany } from "../../../Objects/Model/SpartanCompany";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { BreakdownTile } from "../Breakdowns/BreakdownTile";
import { RankTile } from "./RankTile";

export function AccuracyRanks(props: { company: SpartanCompany, sharedSR: ServiceRecord, goToMember: Function })
{
	const { company, sharedSR, goToMember } = props;

	return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <BreakdownTile title={`${company.name} Accuracy`} value={sharedSR.shots.accuracy} isMainStat isPercent />
                </Box>
                {[...company.players]
                    .sort((a, b) => b.serviceRecord.shots.accuracy - a.serviceRecord.shots.accuracy)
                    .slice(0, 3)
                    .map((player, index) => <RankTile player={player} value={player.serviceRecord.shots.accuracy} rank={index + 1} goToMember={goToMember} isPercent />)}
            </Box>
		</Box>
	);
}