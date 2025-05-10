import { Grid, Box, Typography, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { CSRS } from "../../../Objects/Model/CSRS";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { AssistBreakdown } from "../Breakdowns/AssistBreakdown";
import { CSRSBreakdown } from "../Breakdowns/CSRSBreakdown";
import { DamageBreakdown } from "../Breakdowns/DamageBreakdown";
import { KDABreakdown } from "../Breakdowns/KDABreakdown";
import { KillBreakdownCard } from "../Breakdowns/KillBreakdownCard";
import { KillDeathCard } from "../Breakdowns/KillDeathCard";
import { MatchesBreakdown } from "../Breakdowns/MatchesBreakdown";
import { ShotsBreakdown } from "../Breakdowns/ShotsBreakdown";
import { TimePlayed } from "../Breakdowns/TimePlayed";
import { VehicleBreakdown } from "../Breakdowns/VehicleBreakdown";
import { SeasonsChart } from "../Charts/SeasonsChart";
import { TopMedals } from "../Medals/TopMedals";
import { SeasonChooser } from "./SeasonChooser";
import { ServiceRecordFilters } from "./ServiceRecordFilters";
import { HaloDotAPISeason } from "../../../Database/Schemas/AutocodeMetadata";
import { CareerRankSchema } from "../../../Database/Schemas/CareerRankSchema";
import { CareerRankBreakdown } from "../CareerRank/CareerRankBreakdown";
import { ModeBreakdown } from "../Breakdowns/Modes/ModeBreakdown";
import { FluidAd } from "../Ads/FluidAd";
import { useState } from "react";
import { CSV } from "../../../Objects/Helpers/Statics/CSV";
import { SCData } from "../../../Database/SCData";

interface ServiceRecordGridProps
{
	app: SCData;
	gamertag: string;
	seasons?: HaloDotAPISeason[];
	setSeason?: (season: string) => void;
	setShowPerMatch: (show: boolean) => void;
	showPerMatch: boolean;
	serviceRecord: ServiceRecord;
	csrs?: CSRS[];
	historicStats?: ServiceRecord[];
	isSubscribedToPatreon?: boolean;
	season?: string;
	title?: string;
	careerRank?: CareerRankSchema;
}

export function ServiceRecordGrid(props: ServiceRecordGridProps)
{
	const { app, gamertag, seasons, showPerMatch, serviceRecord, csrs, historicStats, season, title, careerRank, isSubscribedToPatreon, setSeason, setShowPerMatch } = props;

	const [menu, setMenu] = useState(-1);

	/**
	 * Triggered when the Options menu is changed
	 */
	const onOptionChanged = (event: SelectChangeEvent<HTMLElement>) =>
	{
		if (+event.target.value === 0)
		{
			app.logger.LogExport();
			CSV.generate(gamertag, serviceRecord);
		}

		setMenu(-1);
	};

	if (!serviceRecord || serviceRecord.IsEmpty() || serviceRecord.error) { return <></>; }
	return (
		<Grid container spacing={2}>
			{/* Top */}
			<Grid item xs={12}>
				<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
					{setSeason && seasons && <SeasonChooser season={season ?? "All"} setSeason={setSeason} seasons={seasons} />}
					{title && <Typography variant="h5">{title}</Typography>}
					<Box sx={{ flexGrow: 1 }}></Box>
					<ServiceRecordFilters setPerMatch={setShowPerMatch} />
					<FormControl sx={{ width: "150px", ml: 2 }}>
						<InputLabel id="additional-options-select-label"></InputLabel>
						<Select
							labelId="additional-options-select-label"
							id="additional-options-select"
							label=""
							value={menu as any}
							onChange={onOptionChanged}
						>
							<MenuItem disabled value={-1}>Options</MenuItem>
							<MenuItem value={0}>Export to CSV</MenuItem>
						</Select>
					</FormControl>
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
				{!isSubscribedToPatreon && <Grid item xs={12}>
					<FluidAd adId="4720270834" isAdFree={isSubscribedToPatreon} />
				</Grid>}
				<Grid item xs={12}>
					<CareerRankBreakdown careerRank={careerRank} />
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
				{historicStats && (!season) && seasons && <Grid item xs={12}>
					<SeasonsChart seasons={seasons} historicServiceRecords={historicStats} />
				</Grid>}
				{!isSubscribedToPatreon && <Grid item xs={12}>
					<FluidAd adId="4720270834" isAdFree={isSubscribedToPatreon} />
				</Grid>}
				<Grid item xs={12}>
					<ModeBreakdown serviceRecord={serviceRecord} showPerMatch={showPerMatch} />
				</Grid>
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