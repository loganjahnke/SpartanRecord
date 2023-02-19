import { Grid, Box, Typography } from "@mui/material";
import { CSRS } from "../../../Objects/Model/CSRS";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { AssistBreakdown } from "../Breakdowns/AssistBreakdown";
import { CSRSBreakdown } from "../Breakdowns/CSRSBreakdown";
import { DamageBreakdown } from "../Breakdowns/DamageBreakdown";
import { KDABreakdown } from "../Breakdowns/KDABreakdown";
import { KillBreakdownCard } from "../Breakdowns/KillBreakdownCard";
import { KillDeathCard } from "../Breakdowns/KillDeathCard";
import { LevelBreakdown } from "../Breakdowns/LevelBreakdown";
import { MatchesBreakdown } from "../Breakdowns/MatchesBreakdown";
import { ShotsBreakdown } from "../Breakdowns/ShotsBreakdown";
import { TimePlayed } from "../Breakdowns/TimePlayed";
import { VehicleBreakdown } from "../Breakdowns/VehicleBreakdown";
import { SeasonsChart } from "../Charts/SeasonsChart";
import { TopMedals } from "../Medals/TopMedals";
import { SeasonChooser } from "./SeasonChooser";
import { ServiceRecordFilters } from "./ServiceRecordFilters";

interface ServiceRecordGridProps
{
	setSeason?: (season: number) => void;
	setShowPerMatch: (show: boolean) => void;
	showPerMatch: boolean;
	serviceRecord: ServiceRecord;
	csrs?: CSRS[];
	historicStats?: ServiceRecord[];
	isAllowed?: boolean;
	season?: number;
	title?: string;
}

export function ServiceRecordGrid(props: ServiceRecordGridProps)
{
	const { setSeason, setShowPerMatch, showPerMatch, serviceRecord, csrs, historicStats, season, title } = props;

	if (!serviceRecord || serviceRecord.IsEmpty() || serviceRecord.error) { return <></>; }

	return (
		<Grid container spacing={2}>
			{/* Top */}
			<Grid item xs={12}>
				<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
					{setSeason && <SeasonChooser setSeason={setSeason} />}
					{title && <Typography variant="h5">{title}</Typography>}
					<Box sx={{ flexGrow: 1 }}></Box>
					<ServiceRecordFilters setPerMatch={setShowPerMatch} />
				</Box>
			</Grid>
			{/* Always the top three boxes */}
			<Grid container item spacing={2} xs={12} sx={{ flexDirection: "row", alignContent: "flex-start" }}>
				<Grid item xs={12} lg={4}>
					<MatchesBreakdown serviceRecord={serviceRecord} />
				</Grid>
				<Grid item xs={12} lg={4}>
					<KillDeathCard serviceRecord={serviceRecord} showPerMatch={showPerMatch} />
				</Grid>
				<Grid item xs={12} lg={4}>
					<ShotsBreakdown serviceRecord={serviceRecord} showPerMatch={showPerMatch} />
				</Grid>
			</Grid>
			{/* Far left */}
			<Grid container item spacing={2} md={12} lg={6} xl={4} sx={{ alignContent: "flex-start" }}>
				<Grid item xs={12}>
					<KDABreakdown serviceRecord={serviceRecord} />
				</Grid>
				{csrs && csrs.length > 0 && <Grid item xs={12}>
					<CSRSBreakdown csrs={csrs} />
				</Grid>}
				<Grid item xs={12}>
					<AssistBreakdown serviceRecord={serviceRecord} showPerMatch={showPerMatch} />
				</Grid>
				<Grid item xs={12}>
					<DamageBreakdown serviceRecord={serviceRecord} showPerMatch={showPerMatch} />
				</Grid>
			</Grid>
			{/* Middle 6 */}
			<Grid container item spacing={2} sm={12} md={6} lg={6} xl={3} sx={{ alignContent: "flex-start" }}>
				<Grid item xs={12}>
					<KillBreakdownCard serviceRecord={serviceRecord} showPerMatch={showPerMatch} />
				</Grid>
			</Grid>
			{/* Far right */}
			<Grid container item spacing={2} sm={12} md={6} lg={12} xl={5} sx={{ alignContent: "flex-start" }}>
				<Grid item xs={12}>
					<TopMedals medals={serviceRecord.medals} matchesPlayed={serviceRecord.matchesPlayed} showPerMatch={showPerMatch} />
				</Grid>
				<Grid item xs={12}>
					<LevelBreakdown serviceRecord={serviceRecord} showPerMatch={showPerMatch} />
				</Grid>
				{historicStats && (season === undefined || season === -1) && <Grid item xs={12}>
					<SeasonsChart historicServiceRecords={historicStats} />
				</Grid>}
				<Grid container item spacing={2} xs={12}>
					<Grid item xs={12} lg={6}>
						<TimePlayed serviceRecord={serviceRecord} showPerMatch={showPerMatch} />
					</Grid>
					<Grid item xs={12} lg={6}>
						<VehicleBreakdown serviceRecord={serviceRecord} showPerMatch={showPerMatch} />
					</Grid>
				</Grid>
			</Grid>						
		</Grid>
	)
}