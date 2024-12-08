import { Box, Typography } from "@mui/material";
import { GridItemCentered } from "../../Common/GridItemCentered";
import { CalloutsProps } from "../Props/CalloutsProps";
import { GetCareerRankMetadata, LifetimeRank } from "../../../../Objects/Helpers/AllCareerRanks";
import { EmptyCareerRank } from "../../../../Database/Schemas/CareerRankSchema";
import { CareerRankTile } from "../../CareerRank/CareerRankTile";
import { CalloutStat } from "../Typography/CalloutStat";
import { CareerRankMetadata } from "../../../../Database/Schemas/AutocodeMetadata";
import moment from "moment";
import { OpacityBox } from "../../Animations/OpacityBox";

interface CareerRankCalloutProps extends CalloutsProps
{
	heroDelay: string;
	heroSnarkDelay: string;
}

/**
 * A component to wrap text around a zoom animation
 */
export function CareerRankCallout(props: CareerRankCalloutProps)
{
	const { delay, heroDelay, heroSnarkDelay, player } = props;

	if (!player) { return <></>; }

	const careerRankForTheYear = LifetimeRank(player.serviceRecord);

	// Get all ranks into an array
	const allRanks: CareerRankMetadata[] = [];
	for (let i = 2; i <= 272; i++)
	{
		allRanks.push(GetCareerRankMetadata(i));
	}

	// Calculate the XP for the goal date
	const avgScore = careerRankForTheYear.data.level.total_xp / player.serviceRecord.matchesPlayed;
	const gamesPerDay = player.serviceRecord.matchesPlayed / 365;
	const xpToRank = allRanks[allRanks.length - 1].properties.threshold - player.careerRank.data.level.total_xp;
	const matchesToHero = Math.ceil(xpToRank / Math.max(avgScore, 1));

	// Calculate the date for the games / day
	const daysToHeroBasedOnGamesPerDay = Math.ceil(matchesToHero / gamesPerDay);
	const dateToHeroBasedOnGamesPerDay = moment().add(daysToHeroBasedOnGamesPerDay, "days");
	const yearToHero = dateToHeroBasedOnGamesPerDay.get("year");

	// Check if they are already a hero
	const isHero = player.careerRank.data.current.title === "Hero";
	const heroThisYearAloneThatsCrazy = careerRankForTheYear.data.current.title === "Hero";

	return (
		<GridItemCentered>
			<OpacityBox delay={delay} content={
				<>
					<Typography>You earned <CalloutStat text={careerRankForTheYear.data.level.total_xp} /> experience this year. That's enough experience to get to <CalloutStat text={heroThisYearAloneThatsCrazy ? "Hero" : careerRankForTheYear.data.current.subtitle} /> career rank!</Typography>
					<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
						<CareerRankTile rank={careerRankForTheYear ?? EmptyCareerRank()} hideBottomRow ultraLarge />
					</Box>
					{isHero
						?
						<OpacityBox delay={heroDelay} content={
							<>
								<Typography sx={{ mt: 2 }}>Your total career rank is impressive!</Typography>
								<Typography>Congrats on reaching <CalloutStat text="Hero" />!</Typography>
							</>
						} />
						:
						<OpacityBox delay={heroDelay} content={
							<>
								<Typography sx={{ mt: 2 }}>You still need <CalloutStat text={xpToRank} /> experience to get to Hero. With your current pace of play, you'll reach it in <CalloutStat text={daysToHeroBasedOnGamesPerDay} /> days!</Typography>
								<Typography sx={{ mt: 2 }}>That's on <CalloutStat text={dateToHeroBasedOnGamesPerDay.format('L')} />.</Typography>
								{yearToHero > 2030 && yearToHero < 2050 && <OpacityBox delay={heroSnarkDelay} content={<Typography sx={{ mt: 1 }}>I wonder if Halo 7 will be out before you Finish the Fight.</Typography>} />}
								{yearToHero >= 2050 && <OpacityBox delay={heroSnarkDelay} content={<Typography sx={{ mt: 1 }}>Maybe your grandkids can Finish the Fight for you.</Typography>} />}
							</>
						} />
					}
				</>
			} />
		</GridItemCentered>
	);
}