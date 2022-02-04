import { Box, Grid, Typography } from "@mui/material";
import { CampaignRecord } from "../../../Objects/Model/CampaignRecord";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

interface CampaignProps
{
    campaignRecord?: CampaignRecord;
}

export function CampaignBreakdown(props: CampaignProps)
{
	const { campaignRecord } = props;

	return (
        campaignRecord ?
            <Grid container>
                <Grid item xs={4}>
                    <img src={campaignRecord.difficulty?.highestCompletedImage} alt={campaignRecord.difficulty?.highestCompleted} height="64px" />
                </Grid>
                <Grid item xs={8}>
                    <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
                            <BreakdownTile title="Audio Logs" value={campaignRecord.audioLogs?.spartans ?? "Not Completed"} isMainStat />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            : 
            <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
                    <Typography variant="body1">Loading</Typography>
                </Box>
            </Box>
	);
}