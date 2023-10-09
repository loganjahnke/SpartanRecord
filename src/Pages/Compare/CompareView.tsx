import { Box, Button, Divider, Link, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { ViewProps } from "../Props/ViewProps";
import { ServiceRecord } from "../../Objects/Model/ServiceRecord";
import { Cookie } from "../../Objects/Helpers/Cookie";
import { SRTabs } from "../../Assets/Components/Layout/AHDrawer";
import { SR } from "../../Objects/Helpers/Statics/SR";
import { Player } from "../../Objects/Model/Player";
import { Compare } from "../../Assets/Components/Compare/Compare";
import { Grow } from "../../Assets/Components/Common/Grow";
import { DynamicPlayerCard } from "../../Assets/Components/PlayerAppearance/PlayerCard";
import { ChangeCircle, CompareArrows } from "@mui/icons-material";
import { AddGamertagDialog, AddGamertagInline } from "../Spartan Company/AddGamertagDialog";
import { ArrowheadTheme } from "../../Assets/Theme/ArrowheadTheme";
import { CompareHeader } from "../../Assets/Components/Compare/CompareHeader";
import { CompareCareerRank } from "../../Assets/Components/Compare/CompareCareerRank";

export function CompareView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, setBackgroundLoadingProgress, player, updatePlayer, switchTab, setApiError } = props;
	const { gamertag1, gamertag2 } = useParams();
	//#endregion
	
	//#region State
	const [player2, setPlayer2] = useState(new Player());
	const [gamertagToAdd, setGamertagToAdd] = useState("");
	const [addGamertagDialog, setAddGamertagDialog] = useState(false);
	const [loadingProfile, setLoadingProfile] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [recentPlayers, setRecentPlayers] = useState<Player[]>(Cookie.getRecents().map(gamertag => new Player(gamertag)));
	//#endregion

	//#region Add Gamertag Dialog
	/** Loads the recent players' appearances */
	const loadRecentPlayers = useCallback(async () =>
	{
		const recentGamertags = Cookie.getRecents();
		if (!recentGamertags || recentGamertags.length === 0) { return; }

		const players: Player[] = [];
		for (const gamertag of recentGamertags)
		{
			players.push(await app.GetPlayerAppearanceOnly(gamertag));
		}

		setRecentPlayers(players);
	}, [app, setRecentPlayers]);

	/** Opens the add gamertag dialog */
	const openAddGamertag = useCallback(async () =>
	{
		await loadRecentPlayers();
		setAddGamertagDialog(true);
	}, [setAddGamertagDialog, loadRecentPlayers]);

	/**
	 * Does error checking on the gamertag
	 * @param gt the gamertag
	 */
	const errorCheckGamertag = useCallback(async (gt: string) =>
	{
		if (!gt)
		{
			setErrorMessage("Not a valid gamertag!");
			setLoadingProfile(false);
			return "";
		}

		if (gamertag1 === gt)
		{
			setErrorMessage("You already have " + gt + " pulled into the comparison.");
			setLoadingProfile(false);
			return "";
		}

		const realGamertag = await app.IsValidGamertag(gt);
		if (!realGamertag)
		{
			setErrorMessage("Not a valid gamertag!");
			setLoadingProfile(false);
			return "";
		}

		if (gamertag1 === realGamertag)
		{
			setErrorMessage("You already have " + realGamertag + " pulled into the comparison.");
			setLoadingProfile(false);
			return "";
		}

		setLoadingProfile(false);

		return realGamertag;
	}, [app, gamertag1, setErrorMessage, setLoadingProfile]);

	/** Controlled search component */
	function onGamertagTextChange(event: React.ChangeEvent<HTMLInputElement>)
	{
		setGamertagToAdd(event.target.value);
	};

	/** When the search button is pressed */
	async function searchForGamertag()
	{
		if (gamertagToAdd === "") { return; }

		setLoadingProfile(true);
		
		const realGamertag = await errorCheckGamertag(gamertagToAdd);
		if (!realGamertag) { return; }
		
		switchTab(`/compare/${gamertag1}/${realGamertag}`, SRTabs.Compare);
	}

	/** When enter is pressed */
	async function searchForGamertagViaEnter(event: React.KeyboardEvent<HTMLDivElement>)
	{
		if (event.key === "Enter")
		{
			setLoadingProfile(true);
			const realGamertag = await errorCheckGamertag(gamertagToAdd);
			if (!realGamertag) { return; }
			switchTab(`/compare/${gamertag1}/${realGamertag}`, SRTabs.Compare);
		}
	}

	/** Cancels the close */
	const cancelAddGamertagDialog = useCallback(() =>
	{
		setErrorMessage("");
		setAddGamertagDialog(false);
	}, [setErrorMessage, setAddGamertagDialog]);
	
	/** Adds the gamertag from the company */
	const closeAddGamertagDialog = useCallback(async (gamertag?: string) =>
	{
		setLoadingProfile(true);

		const gt = gamertag ?? gamertagToAdd;
		
		const realGamertag = await errorCheckGamertag(gt);
		if (!realGamertag) { return; }

		// Close popup
		cancelAddGamertagDialog();
		setLoadingProfile(false);
		setGamertagToAdd("");

		// Update URL
		switchTab(`/compare/${gamertag1}/${realGamertag}`, SRTabs.Compare);
		
	}, [gamertagToAdd, gamertag1, errorCheckGamertag, cancelAddGamertagDialog, setLoadingProfile, setGamertagToAdd, switchTab]);

	/** Adds a recent gamertag to the spartan company */
	const addRecent = useCallback((gamertag: string) =>
	{
		closeAddGamertagDialog(gamertag);
	}, [closeAddGamertagDialog]);
	//#endregion

	//#region Loading
	/**
	 * Clears the loading messages
	 */
	const clearLoadingMessages = useCallback(() =>
	{
		setLoadingMessage("");
		setBackgroundLoadingProgress("");
	}, [setLoadingMessage, setBackgroundLoadingProgress]);

	/**
	 * Loads the player from firebase
	 * @returns the player object
	 */
	const loadFromFirebase = useCallback(async (gamertag?: string) =>
	{
		if (!gamertag) { return new Player(); }

		// Set page gamertag and show loading message
		setLoadingMessage("Loading " + gamertag);
				
		// Get the player from firebase and show on screen
		return await app.GetPlayerFromFirebase(gamertag);

	}, [app, setLoadingMessage]);

	/**
	 * Loads the player from HaloDotAPI
	 * @param currSR the current service record from Firebase
	 */
	const loadFromHaloDotAPI = useCallback(async (gamertag: string, currSR: ServiceRecord) =>
	{
		// If we are already syncing this gamertag, quit early
		if (!gamertag || app.IsSyncing(gamertag)) 
		{ 
			clearLoadingMessages(); 
			return; 
		}

		// Ensure we can update from HaloDotAPI
		if (!await app.CanUpdate())
		{
			setApiError(true);
			return;
		}

		// Show background loading message
		setLoadingMessage("");
		setBackgroundLoadingProgress(SR.DefaultLoading);

		// Otherwise get latest data from HaloDotAPI
		app.AddToSyncing(gamertag);

		// Get updated player
		const haloDotAPIPlayer = await app.GetPlayerFromHaloDotAPI(gamertag);
		if (!haloDotAPIPlayer) 
		{
			clearLoadingMessages();
			app.RemoveFromSyncing(gamertag);
			return;
		}

		// Store into Firebase
		await app.SetPlayerIntoFirebase(haloDotAPIPlayer, undefined, currSR);

		// Check if HaloDotAPI automatically corrected the gamertag
		// Make sure we point Firebase to the right gamertag
		if (haloDotAPIPlayer.gamertag !== gamertag)
		{
			await app.UpdateGamertagReference(haloDotAPIPlayer.gamertag, gamertag);
		}

		// Remove from syncing tracker
		app.RemoveFromSyncing(gamertag);

		return haloDotAPIPlayer;

	}, [app, setLoadingMessage, setBackgroundLoadingProgress, clearLoadingMessages]);

	/**
	 * Loads the data for the view
	 */
	const loadData = useCallback(async () => 
	{		
		// Gamertag #1 is required
		if (!gamertag1) { switchTab("/", SRTabs.Search); return; }

		// Update tab
		switchTab(undefined, SRTabs.Compare);

		// Load appearances
		if (!gamertag2) { await loadRecentPlayers(); }

		// Get players from Firebase first
		const [firebase1, firebase2] = await Promise.all([
			await loadFromFirebase(gamertag1),
			await loadFromFirebase(gamertag2)
		]);

		// Update Player #1
		updatePlayer(firebase1.gamertag, firebase1.appearance, firebase1.serviceRecord, firebase1.csrs, firebase1.careerRank, firebase1.isPrivate);

		// Need gamertag #2 to continue
		if (!gamertag2) { clearLoadingMessages(); return; }
		
		// Update Player #2
		setPlayer2(firebase2);

		// Get updated stats from HaloDotAPI
		const [api1, api2] = await Promise.all([
			await loadFromHaloDotAPI(gamertag1, firebase1.serviceRecord),
			await loadFromHaloDotAPI(gamertag2, firebase2.serviceRecord)
		]);

		// Update state
		if (api1) { updatePlayer(api1.gamertag, api1.appearance, api1.serviceRecord, api1.csrs, api1.careerRank, api1.isPrivate); }
		if (api2) { setPlayer2(api2); }

		// Clear loading messages
		clearLoadingMessages();

		// Log event
		app.logger.LogViewServiceRecord();

	}, [app, gamertag1, gamertag2, switchTab, loadRecentPlayers, updatePlayer, loadFromFirebase, loadFromHaloDotAPI, clearLoadingMessages]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gamertag1, gamertag2]);
	//#endregion

	const bestCurCSR1 = player?.GetBestCurrentCSR();
	const bestCurCSR2 = player2?.GetBestCurrentCSR();
	const bestCurBack = (bestCurCSR1?.ranks.current.value ?? 0) > (bestCurCSR2?.ranks.current.value ?? 0) ? bestCurCSR1?.ranks.current.GetBackground() : bestCurCSR2?.ranks.current.GetBackground();
	const bestAllCSR1 = player?.GetBestAllTimeCSR();
	const bestAllCSR2 = player2?.GetBestAllTimeCSR();
	const bestAllBack = (bestAllCSR1?.ranks.allTime.value ?? 0) > (bestAllCSR2?.ranks.allTime.value ?? 0) ? bestAllCSR1?.ranks.allTime.GetBackground() : bestAllCSR2?.ranks.allTime.GetBackground();

	return (
		<Box component="main" sx={{ flexGrow: 1, height: gamertag1 && gamertag2 ? "auto" : "calc(100% - 32px)" }}>
			<Helmet>
				<title>{"Spartan Record | Compare"}</title>
				<meta name="description" content={`Comparing Halo Infinite service records for ${gamertag1} and ${gamertag2}`} />
				<meta property="og:title" content="Spartan Record" />
            	<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/compare/${gamertag1}/${gamertag2}`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<AddGamertagDialog 
				open={addGamertagDialog} 
				gamertag={gamertagToAdd} 
				accept={closeAddGamertagDialog} 
				cancel={cancelAddGamertagDialog} 
				onChange={onGamertagTextChange} 
				search={searchForGamertag} 
				searchViaEnter={searchForGamertagViaEnter} 
				addRecent={addRecent} 
				loading={loadingProfile} 
				recentPlayers={recentPlayers}
				error={errorMessage} />
			{gamertag1 && gamertag2 &&
				<Box sx={{ p: player ? 2 : 0, height: "calc(100% - 64px)" }}>
					<Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", pt: 1, pb: 4 }}>
						<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
								<>
									<CompareHeader topOfImage
										changeButton={!gamertag2 ? undefined : <Button startIcon={<ChangeCircle />} sx={{ mt: 2 }} size="small" variant="text" onClick={openAddGamertag}>Change Gamertag</Button>}
										compare1={<DynamicPlayerCard player={player} topDown rightAlign noMargin />}
										compare2={gamertag2 ? <DynamicPlayerCard player={player2} topDown noMargin /> : <Button startIcon={<CompareArrows />} size="small" variant="contained" onClick={openAddGamertag}>Compare</Button>}
										icon={<CompareArrows sx={{ color: ArrowheadTheme.leftEarlyText }} />}
										backgroundURL="url(https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/playlists/ffa-slayer.jpg)"
									/>
									<Box sx={{ maxWidth: "800px", width: "100%", backgroundColor: ArrowheadTheme.box, borderRadius: "0 0 12px 12px" }}>
										<CompareCareerRank category="Rank" value1={player?.careerRank} value2={player2.careerRank} />
										<Compare category="Matches" value1={player?.serviceRecord.matchesPlayed} value2={player2.serviceRecord.matchesPlayed} />
										<Compare category="Win Percentage" value1={player?.serviceRecord.winRate} value2={player2.serviceRecord.winRate} isPercent />
										<Compare category="KDA" value1={player?.serviceRecord.kda} value2={player2.serviceRecord.kda} />
										<Compare category="KDR" value1={player?.serviceRecord.kdr} value2={player2.serviceRecord.kdr} />
										<Compare category="Kills / Game" value1={player?.serviceRecord.killsPerGame} value2={player2.serviceRecord.killsPerGame} />
										<Compare category="Deaths / Game" value1={player?.serviceRecord.deathsPerGame} value2={player2.serviceRecord.deathsPerGame} lessIsBetter />
										<Compare category="Assists / Game" value1={player?.serviceRecord.assistsPerGame} value2={player2.serviceRecord.assistsPerGame} />
										<Compare category="Kill Death Spread / Game" value1={player?.serviceRecord.killDeathSpreadPerGameVal} value2={player2.serviceRecord.killDeathSpreadPerGameVal} />
										<Compare category="Current CSR" display1={bestCurCSR1?.ranks.current.GetDisplay()} value1={bestCurCSR1?.ranks.current.value} display2={bestCurCSR2?.ranks.current.GetDisplay()} value2={bestCurCSR2?.ranks.current.value} background={bestCurBack} />
										<Compare category="All-Time CSR" display1={bestAllCSR1?.ranks.allTime.GetDisplay()} value1={bestAllCSR1?.ranks.allTime.value} display2={bestAllCSR2?.ranks.allTime.GetDisplay()} value2={bestAllCSR2?.ranks.allTime.value} background={bestAllBack} />
										<Compare category="Damage / Game" value1={player?.serviceRecord.damagePerGame} value2={player2.serviceRecord.damagePerGame} />
										<Compare category="Accuracy" value1={player?.serviceRecord.shots.accuracy} value2={player2.serviceRecord.shots.accuracy} isPercent />
										<Compare category="Damage Efficiency" value1={player ? player?.serviceRecord.damageEfficiency * 100 : 0} value2={player2.serviceRecord.damageEfficiency * 100} isPercent />
									</Box>
								</>
						</Box>
					</Box>
				</Box>
			}
			{(!gamertag1 || !gamertag2) &&
				<Box sx={{ backgroundColor: "secondary.main", height: "100%", display: "flex", flexDirection: "column" }}>
					<Grow />
					<Box sx={{ backgroundColor: "secondary.main", display: "flex", flexDirection: "column", textAlign: "center", alignItems: "center", pl: 4, pr: 4 }}>
						<Typography variant="h3">Compare Service Records</Typography>
						<Typography variant="h6">Search for a gamertag to compare Halo Infinite statistics such as KDA, KDR, and more</Typography>
						<AddGamertagInline showSearchButton search={gamertagToAdd} onKeyPress={searchForGamertagViaEnter} onSearch={searchForGamertag} onValueChanged={onGamertagTextChange} openRecent={addRecent} loading={loadingProfile} error={errorMessage} recentPlayers={recentPlayers} favoritePlayers={[]} />
					</Box>
					<Grow />
					<Box sx={{ backgroundColor: "secondary.main", textAlign: "center", mt: 18 }}>
						<Typography variant="subtitle1" sx={{ textAlign: "center" }}>Powered by <Link sx={{ cursor: "pointer" }} onClick={() => switchTab("/powered_by_halodotapi")}>HaloDotAPI</Link> v{process.env.REACT_APP_HALO_API_VERSION} | Spartan Record v{process.env.REACT_APP_VERSION}</Typography>
					</Box>
				</Box>
			}
		</Box>
	);
}