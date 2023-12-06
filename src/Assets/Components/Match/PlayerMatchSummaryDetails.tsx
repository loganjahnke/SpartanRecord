import { Box } from "@mui/material";
import { PlayerMatchPlayer } from "../../../Objects/Pieces/PlayerMatchPlayer";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { LeftvsRight } from "../Breakdowns/Templates/LeftvsRight";
import { MatchBreakdown } from "../Breakdowns/Templates/MatchBreakdown";
import { CSRSProgression } from "../Custom/CSRSTooltip";
import { GenericMode } from "./Mode/GenericMode";
import { MatchMode } from "./Mode/MatchMode";
import { OutcomeChip } from "./OutcomeChip";
import { MatchPlayer } from "../../../Objects/Pieces/MatchPlayer";
import { MedalTile } from "../Medals/MedalTile";

export enum MedalsMode
{
	none = 1,
	top3 = 2,
	all = 3
}

interface PlayerMatchSummaryDetailsProps
{
	player?: PlayerMatchPlayer | MatchPlayer;
	isRanked?: boolean;
	isPVE?: boolean;
	medalsMode: MedalsMode;
}

export function PlayerMatchSummaryDetails(props: PlayerMatchSummaryDetailsProps)
{
	const { player, isRanked, isPVE, medalsMode } = props;

	if (!player) { return <></>; }
	if (player instanceof MatchPlayer && !player.stats) { return <></>; }

	const stats = (player instanceof PlayerMatchPlayer) ? player.summary : player.stats.summary;
	const damage = (player instanceof PlayerMatchPlayer) ? player.damage : player.stats.damage;
	const shots = (player instanceof PlayerMatchPlayer) ? player.shots : player.stats.shots;
	const mode = (player instanceof PlayerMatchPlayer) ? player.mode : player.stats.mode;
	const medals = (player instanceof PlayerMatchPlayer) ? player.medals : player.stats.medals;
	
	//#region Kills / Deaths Component
	const KillsComponent = <Box sx={{ mt: 2, display: "flex", justifyContent: "center", width: "100%" }}>
		<MatchBreakdown emphasize
				main={isPVE
					? new LeftvsRight(stats.assists, stats.deaths, "Assists", "Deaths", player.killExpectations.expected, player.deathExpectations.expected)
					: new LeftvsRight(stats.kills, stats.deaths, "Kills", "Deaths", player.killExpectations.expected, player.deathExpectations.expected, stats.assists, "Assists")}
				additional={[
					new LeftvsRight(Math.round(player.killExpectations.expected * 10) / 10, Math.round(player.deathExpectations.expected * 10) / 10, "", "", undefined, undefined, undefined, "expected", "Expectations: Halo Infinite's expected kills/deaths for the player."),
				]}
			/>
	</Box>;
	//#endregion

	//#region Damage Component
	const DamageComponent = <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
		<MatchBreakdown 
			main={new LeftvsRight(damage.dealt, damage.taken, "Damage Dealt", "Damage Taken")}
			additional={[
				new LeftvsRight(Math.round(player.damageEfficiency * 100).toLocaleString() + "%", Math.round(player.enemyDamageEfficiency * 100).toLocaleString() + "%", "", "", undefined, undefined, undefined, "efficiency", "Damage Efficiency: the ratio of the exact amount of damage needed to kill a player over the damage dealt per kill/death."),
				new LeftvsRight(player.maximumKillsFromDamage.toLocaleString(), player.maximumDeathsFromDamage.toLocaleString(), "", "", undefined, undefined, undefined, "EQKD", "Equivalent Kills/Deaths: the equivalent number of kills or deaths if all your damage resulted in a kill or death. 275 damage per kill."),
			]}
		/>
	</Box>;
	//#endregion

	//#region Accuracy Component
	const AccuracyComponent = <Box sx={{ mt: 2, display: "flex", justifyContent: "center", width: "100%" }}>
		<MatchBreakdown main={new LeftvsRight(shots.landed, shots.missed, "Shots Landed", "Shots Missed")} />
	</Box>;
	//#endregion

	//#region CSR Component
	const CSRComponent = <Box sx={{ backgroundColor: ArrowheadTheme.card, width: "100%", marginLeft: "-16px", padding: "8px 16px" }}>
		<Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 2, mb: 2 }}>
			<CSRSProgression pre={player.csr.pre} post={player.csr.post} noBackground />
		</Box>
	</Box>;
	//#endregion

	//#region Medals Component
	const MedalsComponent = <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
		{medals.sort((a, b) => b.CompareTo(a)).map((medal, index) => (medalsMode === MedalsMode.all || index <= 2) && <>
				<MedalTile medal={medal} small />
			</>
		)}
	</Box>;
	//#endregion

	return (
		<>
			<Box sx={{ backgroundColor: ArrowheadTheme.box, width: "100%", marginLeft: "-16px", padding: "8px 16px" }}>
				<OutcomeChip player={player} />
				{KillsComponent}
				<GenericMode player={player} isPVE={isPVE} />
				{!isPVE && DamageComponent}
				{AccuracyComponent}
				{medalsMode !== MedalsMode.none && MedalsComponent}
				<Box sx={{ mt: 2 }} />
				<MatchMode mode={mode} />
			</Box>
			{isRanked && CSRComponent}
		</>
	);
}