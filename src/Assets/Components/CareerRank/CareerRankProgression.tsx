import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { CareerRankSchema, EmptyCareerRank } from "../../../Database/Schemas/CareerRankSchema";
import { GetCareerRankMetadata, LifetimeRank } from "../../../Objects/Helpers/AllCareerRanks";
import { CareerRankMetadata } from "../../../Database/Schemas/AutocodeMetadata";
import { CareerRankBreakdown } from "./CareerRankBreakdown";
import { CareerRankProgressionRow } from "./CareerRankProgressionRow";
import { CareerRankProgressionColumn } from "./CareerRankProgressionColumn";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { ShowLifetimeToggle } from "./ShowLifetimeToggle";
import { AutoAd } from "../Ads/AutoAd";
import { FluidAd } from "../Ads/FluidAd";

import { SpartanCompanyIcon } from "../../Icons/CustomIcons";

import "../../Styles/Components/CareerRankProgression.css";
import { HeroTrackerDialog } from "./HeroTrackerDialog";

export function CareerRankProgression(props: { current: CareerRankSchema, serviceRecord: ServiceRecord, isSubscribedToPatreon?: boolean })
{
	//#region Props
	const { current, serviceRecord, isSubscribedToPatreon } = props;
	//#endregion

	//#region State
	const [expandedType, setExpandedType] = useState(current?.data?.current?.properties?.type ?? "");
	const [rank, setRank] = useState(current);
	const [openHeroTracker, setOpenHeroTracker] = useState(false);
	//#endregion

	//#region Refs
	const lifetimeShown = useRef(false);
	//#endregion

	//#region Callbacks
	/** Sets the appropriate career rank */
	const setShowLifetimeCallback = useCallback((show: boolean) =>
	{
		const rankToShow = (show ? LifetimeRank(serviceRecord) : current) ?? EmptyCareerRank();
		setRank(rankToShow);
		const type = rankToShow?.data?.current?.title === "Hero" ? "Hero" : rankToShow?.data?.current?.properties?.type;
		setExpandedType(type ?? "");
	}, [current, serviceRecord, setRank, setExpandedType]);
	//#endregion

	//#region Effects
	useEffect(() =>
	{
		setShowLifetimeCallback(lifetimeShown.current);
	}, [current, serviceRecord, setShowLifetimeCallback]);
	//#endregion

	//#region Calculated Properties
	const previous = GetCareerRankMetadata((current?.data?.current?.rank ?? 1) - 1);

	if (!previous) { return <></>; }
	if (!current?.data?.level) { return <></>; }

	// Get all ranks into an array
	const allRanks: CareerRankMetadata[] = [];
	for (let i = 2; i <= 272; i++)
	{
		allRanks.push(GetCareerRankMetadata(i));
	}

	// Get average score
	const avgScore = serviceRecord.totalScore / serviceRecord.matchesPlayed;
	//#endregion

	return (
		<Box>
			<HeroTrackerDialog open={openHeroTracker} rank={rank} allRanks={allRanks} avgScore={avgScore} isSubscribedToPatreon={isSubscribedToPatreon} close={() => setOpenHeroTracker(false)} />
			<Grid container spacing={2} className="currentProgressionGrid">
				{/* Top */}
				<Grid item xs={12}>
					<Box sx={{ display: "flex", alignItems: "center", ml: 1, mb: 1 }}>
						{rank.data.current.title !== "Hero" && <Button variant="outlined" endIcon={<SpartanCompanyIcon />} onClick={() => setOpenHeroTracker(true)}>Hero Tracker</Button>}
						<Box sx={{ flexGrow: 1 }}></Box>
						<ShowLifetimeToggle setShowLifetime={setShowLifetimeCallback} />
					</Box>
				</Grid>
				{!isSubscribedToPatreon && <Grid item xs={12} sm={12} md={0} sx={{ display: { md: "none" }}}>
					<FluidAd adId="4720270834" isAdFree={isSubscribedToPatreon} />
				</Grid>}
				<Grid item xs={0} sm={0} md={2} lg={3} xl={4} sx={{ p: 1, maxHeight: "128px" }}><AutoAd adId="9800211278" isAdFree={isSubscribedToPatreon} /></Grid>
				<Grid item xs={12} sm={12} md={8} lg={6} xl={4}>
					<CareerRankBreakdown careerRank={rank} />
				</Grid>
				<Grid item xs={0} sm={0} md={2} lg={3} xl={4} sx={{ p: 1, maxHeight: "128px" }}><AutoAd adId="9800211278" isAdFree={isSubscribedToPatreon} /></Grid>
			</Grid>
			<Box sx={{ display: { xs: "none", sm: "none", md: "none", lg: "block", xl: "block" }}}>
				<CareerRankProgressionRow allRanks={allRanks} type="Bronze" current={rank} avgScore={avgScore} />
				<CareerRankProgressionRow allRanks={allRanks} type="Silver" current={rank} avgScore={avgScore} />
				<CareerRankProgressionRow allRanks={allRanks} type="Gold" current={rank} avgScore={avgScore} />
				<CareerRankProgressionRow allRanks={allRanks} type="Platinum" current={rank} avgScore={avgScore} />
				<CareerRankProgressionRow allRanks={allRanks} type="Diamond" current={rank} avgScore={avgScore} />
				<CareerRankProgressionRow allRanks={allRanks} type="Onyx" current={rank} avgScore={avgScore} />
				<CareerRankProgressionRow allRanks={allRanks} type="Hero" current={rank} avgScore={avgScore} />
				<Box sx={{ height: "20px" }} />
			</Box>
			<Box sx={{ display: { xs: "block", sm: "block", md: "block", lg: "none", xl: "none" }}}>
				<CareerRankProgressionColumn allRanks={allRanks} type="Bronze" expanded={expandedType === "Bronze"} current={rank} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Silver" expanded={expandedType === "Silver"} current={rank} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Gold" expanded={expandedType === "Gold"} current={rank} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Platinum" expanded={expandedType === "Platinum"} current={rank} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Diamond" expanded={expandedType === "Diamond"} current={rank} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Onyx" expanded={expandedType === "Onyx"} current={rank} avgScore={avgScore} setExpanded={setExpandedType} />
				<CareerRankProgressionColumn allRanks={allRanks} type="Hero" expanded={expandedType === "Hero"} current={rank} avgScore={avgScore} setExpanded={setExpandedType} />
			</Box>
		</Box>
	);
}