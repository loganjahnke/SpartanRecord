import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import ChartTile from "../Tiles and Tables/ChartTile";
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { ArrowheadFirebase, HaloMap, HaloMode, YesNoAll } from "../Database/ArrowheadFirebase";

import Tile, { TileSize } from "../Tiles and Tables/Tile";
import { Header } from "../Assets/Components/Header";
import { Footer } from "../Assets/Components/Footer";

import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { Player } from "../Objects/Model/Player";
import { Appearance } from "../Objects/Model/Appearance";
import { Halo5Converter } from "../Objects/Helpers/Halo5Converter";
import { FormControl, InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { MatchFilter } from "../Objects/Model/Match";

enum SingleView
{
	ServiceRecord = "ServiceRecord",
	PerMatch = "PerMatch",
	PerKill = "PerKill"
}

export function SingleUser(props: { arrowheadDB: ArrowheadFirebase })
{
	//#region Props and params
    const { arrowheadDB } = props;
    const { gamertag } = useParams();
	//#endregion

	//#region Navigation
    const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	const filter = useRef<MatchFilter>(new MatchFilter());
	//#endregion

	//#region States
	const [serviceRecord, setServiceRecord] = useState(new ServiceRecord());
	const [myPlayer, setMyPlayer] = useState(new Player());
	const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [view, setView] = useState(SingleView.ServiceRecord);
	const [loadingMessage, setLoadingMessage] = useState("");
	//#endregion

	//#region Functions
	/**
     * Filters unique values based on matches played
     * @param key the prop to filter to
     * @returns array of number results
     */
	function mapToKey(key: keyof any): number[]
	{
		if (myPlayer?.historicStats)
		{
			return myPlayer.historicStats.map((h: any) => h[key]);
		}
		
		return [];
	}

	/**
	 * Gets the proper formatted value to show in the tile
	 * @param val the value of the statistic
	 * @returns if perMatch is true, divides the value by number of matches played
	 */
	 function getPlacementToShow(val: number, noPerMatch?: boolean, noPerKill?: boolean): undefined | number
	 {
		 if ((noPerMatch && view === SingleView.PerMatch) || (noPerKill && view === SingleView.PerKill)) { return undefined; }
		 return val;
	 }
 
	/**
	 * Gets the proper formatted value to show in the tile
	 * @param val the value of the statistic
	 * @returns if perMatch is true, divides the value by number of matches played
	 */
	function getValueToShow(val: number, noPerMatch?: boolean, noPerKill?: boolean): string | number
	{	
		if (!noPerMatch && view === SingleView.PerMatch) { return val / serviceRecord.matchesPlayed; }
		if (!noPerKill && view === SingleView.PerKill) { return val / serviceRecord.summary.kills; }
		return val;
	}
 
	/**
	 * Gets all ranks for a certain statistic, I'm sure there is a sexier way to do this
	 * @param key key of ServiceRecord
	 * @param subkey subkey of ServiceRecord
	 * @param subsubkey third key of ServiceRecord
	 * @returns all statistics for the given keys
	 */
	function getAllRanks(key: keyof any, subkey?: keyof any, subsubkey?: keyof any): { gamertag: string, value: number | string }[]
	{
		if (!filter.current.IsEmpty()) { return []; }
		return allPlayers.map((player: any) =>
		{
			const v = subkey && subsubkey 
				? player.serviceRecord[key][subkey][subsubkey] 
				: subkey 
				? player.serviceRecord[key][subkey] 
				: player.serviceRecord[key];

			let rank:  { gamertag: string, value: number | string } = {
				gamertag: player.serviceRecord.gamertag,
				value: v as string
			};

			if (typeof v === "number")
			{
				if (view === SingleView.PerMatch)
				{
					rank.value = v / player.serviceRecord.matchesPlayed;
				}
				else if (view === SingleView.PerKill)
				{
					rank.value = v / player.serviceRecord.summary.kills;
				}
			}

			return rank;
		});
	}
	//#endregion

	//#region Callbacks
	const changeView = useCallback((_event: React.MouseEvent<HTMLElement>, newView: SingleView) => 
	{
		if (newView !== null)
		{
			setView(newView);
		}
	}, [setView]);

	const goHome = useCallback(() =>
	{
		navigate("/");
	}, [navigate]);
	
	/** Sets the service record after filtering */
	const setServiceRecordAfterFiltering = useCallback(async () =>
	{
		if (filter.current.IsEmpty()) 
		{ 
			setServiceRecord(myPlayer.serviceRecord); 
			return;
		}

		setLoadingMessage("Filtering matches");

		let sr = new ServiceRecord();
		const matches = await arrowheadDB.GetMatchesForFilter(myPlayer.gamertag, filter.current);
		if (matches && matches.length > 0)
		{
			sr = matches?.map(match => 
			{
				const sr = match.player.stats;
				sr.totalScore = match.player.stats.totalScore;
				sr.breakdowns.matches.wins = match.player.outcome === "win" ? 1 : 0;
				sr.breakdowns.matches.losses = match.player.outcome === "loss" ? 1 : 0;
				sr.breakdowns.matches.draws = match.player.outcome === "draw" ? 1 : 0;
				sr.breakdowns.matches.left = match.player.outcome === "left" ? 1 : 0; // TODO: check if this is right
				return match.player.stats;
			}).reduce((prev, curr) => prev?.AddServiceRecord(curr) ?? curr) ?? new ServiceRecord();
		}

		setServiceRecord(sr);
		setLoadingMessage("");

	}, [arrowheadDB, myPlayer, setServiceRecord, filter]);

	/** Sets the map filter */
	const handleMapFilter = useCallback((event: SelectChangeEvent<HaloMap>) => 
	{ 
		filter.current.map = event.target.value as HaloMap;
		setServiceRecordAfterFiltering();
	}, [filter, setServiceRecordAfterFiltering]);

	/** Sets the mode filter */
	const handleModeFilter = useCallback((event: SelectChangeEvent<HaloMode>) => 
	{ 
		filter.current.mode = event.target.value as HaloMode;
		setServiceRecordAfterFiltering();
	}, [filter, setServiceRecordAfterFiltering]);

	/** Sets the win filter */
	const handleIsWinFilter = useCallback((event: SelectChangeEvent<YesNoAll>) => 
	{ 
		filter.current.isWin = event.target.value as YesNoAll;
		setServiceRecordAfterFiltering();
	}, [filter, setServiceRecordAfterFiltering]);

	/** Sets the rank filter */
	const handleIsRankedFilter = useCallback((event: SelectChangeEvent<YesNoAll>) => 
	{ 
		filter.current.isRanked = event.target.value as YesNoAll;
		setServiceRecordAfterFiltering();
	}, [filter, setServiceRecordAfterFiltering]);

	//#region Load Data
    const loadData = useCallback(async () => 
    {		
		if (!await arrowheadDB.PopulateMembers()) { return; }
		const players: Player[] = [];
		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Service Records");
		
        // Get last update instant
        await arrowheadDB.GetLastUpdate();
		lastUpdate.current = arrowheadDB.lastUpdate;
		
        if (allPlayers.length === 0 && gamertag)
        {
			// Get all service records
			for (const user of arrowheadDB.members)
			{
				setLoadingMessage("Loading " + user);
				const serviceRecord = await arrowheadDB.GetCurrentServiceRecord(user);
				if (!serviceRecord) { continue; }

				const player = new Player(user);
				player.serviceRecord = serviceRecord;

				if (gamertag === user) 
				{ 
					setLoadingMessage("Loading historic stats");
					player.historicStats = await arrowheadDB.GetHistoricServiceRecord(user) ?? [];

					setLoadingMessage("Loading appearance");
					player.appearance = await arrowheadDB.GetAppearance(user) ?? new Appearance();

					// setLoadingMessage("Loading match history");
					// player.matches = await arrowheadDB.GetAllMatches(user) ?? [];

					setMyPlayer(player); 
					setServiceRecord(player.serviceRecord);
				}

				// Push into larger array
				players.push(player);
			}
        }

		setAllPlayers(players);
		setLoadingMessage("");

    }, [setAllPlayers, setMyPlayer, gamertag, lastUpdate, arrowheadDB, allPlayers]);
	//#endregion
	//#endregion

	//#region Effects
    useEffect(() =>
    {
        loadData();
    }, []);

    useEffect(() =>
    {
        /**
         * Loops through all keys in a generic object to compare the placement against a larger array of generic objects
         * @param obj object of type K
         * @param them collection of other objects of type K
         * @param ranks resulting ranking of the object compared to them of type K
         * @returns 
         */
         function loopThroughGenericObject(obj: any, them: any, ranks: any, myMatchesPlayed: number, themMatchesPlayed: number[])
         {
            let key: keyof any;
            for (key in obj)
            {
                if (typeof obj[key] === "string") { return; }
                if (typeof obj[key] === "number") { setPlacementForStat(key, obj, them, ranks, myMatchesPlayed, themMatchesPlayed); }
                else { loopThroughGenericObject(obj[key], them.map((t: any) => t[key]), ranks[key], myMatchesPlayed, themMatchesPlayed); }
            }
         }
 
         /**
          * Sets the placement for the key in the generic object against the generic array
          * @param key the key of the property in the generic object
          * @param obj the generic object
          * @param them the generic array
          * @param ranks the resulting rank
          */
         function setPlacementForStat(key: keyof any, obj: any, them: any[], ranks: any, myMatchesPlayed: number, themMatchesPlayed: number[])
         {
            let placement = 0;
            const me = view === SingleView.PerMatch ? obj[key] / myMatchesPlayed : obj[key];
            for (let i = 0; i < them.length; i += 1)
            {
				const themAmount = view === SingleView.PerMatch ? them[i][key] / themMatchesPlayed[i] : them[i][key];
                if (themAmount >= me) { placement += 1; }
            }
 
            if (typeof ranks[key] === "number")
            {
                (ranks[key] as any) = placement;
            }
         }

        const ranks = new ServiceRecord();
        loopThroughGenericObject(myPlayer.serviceRecord, allPlayers.map(them => them.serviceRecord), ranks, myPlayer.serviceRecord.matchesPlayed, allPlayers.map(them => them.serviceRecord.matchesPlayed));
        myPlayer.placement = ranks;
		setMyPlayer(myPlayer);
    }, [myPlayer, allPlayers, view]);
	//#endregion
    
    return (
        <Box sx={{ flexGrow: 1, backgroundColor: "primary.dark", paddingTop: 10 }}>
            <Header title={myPlayer.gamertag} spartanRank={Halo5Converter.GetLevelFromScore(myPlayer.serviceRecord.totalScore)} leftImage={myPlayer.appearance.emblemURL} backdrop={myPlayer.appearance.backdropURL} subtitle={myPlayer.appearance.serviceTag} onArrowheadButtonClick={goHome} />
			<Box sx={{ mt: 2, display: "flex", flexDirection: "row", justifyContent: "center" }}>
				<FormControl sx={{ mr: 2, width: "175px" }}>
					<InputLabel id="map-filter-label">Map</InputLabel>
					<Select labelId="map-filter-label" id="map-filter-select" value={filter.current.map} label="Map" onChange={handleMapFilter}>
						<MenuItem value={HaloMap.All}>All</MenuItem>
						<ListSubheader>Arena</ListSubheader>
						<MenuItem value={HaloMap.Aquarius}>Aquarius</MenuItem>
						<MenuItem value={HaloMap.Bazaar}>Bazaar</MenuItem>
						<MenuItem value={HaloMap.Behemoth}>Behemoth</MenuItem>
						<MenuItem value={HaloMap.LaunchSite}>Launch Site</MenuItem>
						<MenuItem value={HaloMap.LiveFire}>Live Fire</MenuItem>
						<MenuItem value={HaloMap.Recharge}>Recharge</MenuItem>
						<MenuItem value={HaloMap.Streets}>Streets</MenuItem>
						<ListSubheader>Big Team Battle</ListSubheader>
						<MenuItem value={HaloMap.Deadlock}>Deadlock</MenuItem>
						<MenuItem value={HaloMap.Fragmentation}>Fragmentation</MenuItem>
						<MenuItem value={HaloMap.Highpower}>Highpower</MenuItem>
					</Select>
				</FormControl>
				<FormControl sx={{ mr: 2, width: "175px" }}>
					<InputLabel id="mode-filter-label">Mode</InputLabel>
					<Select labelId="mode-filter-label" id="mode-filter-select" value={filter.current.mode} label="Mode" onChange={handleModeFilter}>
						<MenuItem value={HaloMode.All}>All</MenuItem>
						<MenuItem value={HaloMode.CTF}>CTF</MenuItem>
						<MenuItem value={HaloMode.Fiesta}>Fiesta</MenuItem>
						<MenuItem value={HaloMode.Oddball}>Oddball</MenuItem>
						<MenuItem value={HaloMode.Slayer}>Slayer</MenuItem>
						<MenuItem value={HaloMode.Stockpile}>Stockpile</MenuItem>
						<MenuItem value={HaloMode.Strongholds}>Strongholds</MenuItem>
						<MenuItem value={HaloMode.TacticalSlayer}>Tactical Slayer</MenuItem>
						<MenuItem value={HaloMode.TotalControl}>Total Control</MenuItem>
					</Select>
				</FormControl>
				<ToggleButtonGroup className="viewToggleButtons" value={view} onChange={changeView} exclusive>
					<ToggleButton value={SingleView.ServiceRecord} key={SingleView.ServiceRecord}>Service Record</ToggleButton>
					<ToggleButton value={SingleView.PerMatch} key={SingleView.PerMatch}>Per Match</ToggleButton>
				</ToggleButtonGroup>
				<FormControl sx={{ ml: 2, width: "175px" }}>
					<InputLabel id="ranked-filter-label">Ranked</InputLabel>
					<Select labelId="ranked-filter-label" id="ranked-filter-select" value={filter.current.isRanked} label="Ranked" onChange={handleIsRankedFilter}>
						<MenuItem value={YesNoAll.All}>All</MenuItem>
						<MenuItem value={YesNoAll.Yes}>Yes</MenuItem>
						<MenuItem value={YesNoAll.No}>No</MenuItem>
					</Select>
				</FormControl>
				<FormControl sx={{ ml: 2, width: "175px" }}>
					<InputLabel id="win-filter-label">Win</InputLabel>
					<Select labelId="win-filter-label" id="win-filter-select" value={filter.current.isWin} label="Win" onChange={handleIsWinFilter}>
						<MenuItem value={YesNoAll.All}>All</MenuItem>
						<MenuItem value={YesNoAll.Yes}>Yes</MenuItem>
						<MenuItem value={YesNoAll.No}>No</MenuItem>
					</Select>
				</FormControl>
			</Box>
            <div className="split">
				<Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={!!loadingMessage}>
					<CircularProgress color="inherit" />
					<div className="loadingMessage">{loadingMessage}</div>
				</Backdrop>
                <div className="left">
                    <div className="tileHolder">
                        <Tile description="Kills" placement={getPlacementToShow(myPlayer.placement.summary.kills)} value={getValueToShow(serviceRecord.summary.kills)} fullRanks={getAllRanks("summary", "kills")} gamertag={gamertag} size={TileSize.half} noTooltip={!filter.current.IsEmpty()} />
                        <Tile description="Deaths" placement={getPlacementToShow(myPlayer.placement.summary.deaths)} value={getValueToShow(serviceRecord.summary.deaths)} fullRanks={getAllRanks("summary", "deaths")} gamertag={gamertag} size={TileSize.half} lessIsBetter noTooltip={!filter.current.IsEmpty()} />
                        <Tile description="Assists" placement={getPlacementToShow(myPlayer.placement.summary.assists)} value={getValueToShow(serviceRecord.summary.assists)} fullRanks={getAllRanks("summary", "assists")} gamertag={gamertag} size={TileSize.half} noTooltip={!filter.current.IsEmpty()} />
						<Tile description="KDA" placement={getPlacementToShow(myPlayer.placement.kda, true, true)} value={getValueToShow(serviceRecord.kda, true, true)} noTooltip={view === SingleView.PerMatch || !filter.current.IsEmpty()} fullRanks={getAllRanks("kda")} gamertag={gamertag} size={TileSize.half} />
						<Tile description="K/D" placement={getPlacementToShow(myPlayer.placement.kdr, true, true)} value={getValueToShow(serviceRecord.kdr, true, true)} noTooltip={view === SingleView.PerMatch || !filter.current.IsEmpty()} fullRanks={getAllRanks("kdr")} gamertag={gamertag} size={TileSize.half} />
                        <Tile description="Matches" placement={getPlacementToShow(myPlayer.placement.matchesPlayed, true, true)} value={getValueToShow(serviceRecord.matchesPlayed, true, true)} fullRanks={getAllRanks("matchesPlayed")} noTooltip={view === SingleView.PerMatch || !filter.current.IsEmpty()} gamertag={gamertag} size={TileSize.half} />
                        <Tile description="Win Rate" placement={getPlacementToShow(myPlayer.placement.winRate, true, true)} value={getValueToShow(serviceRecord.winRate, true, true)} fullRanks={getAllRanks("winRate")} noTooltip={view === SingleView.PerMatch || !filter.current.IsEmpty()} isPercent gamertag={gamertag} size={TileSize.half} />
					</div>
                    <div className="tileHolder">
                        <ChartTile description="KDA" data={mapToKey("kda")} />
                        <ChartTile description="KDR" data={mapToKey("kdr")} />
                        <ChartTile description="Win Rate" data={mapToKey("winRate")} />
                    </div>
					<div className="tileHolder">
						<Tile description="Score" placement={getPlacementToShow(myPlayer.placement.totalScore)} value={getValueToShow(serviceRecord.totalScore)} fullRanks={getAllRanks("totalScore")} gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.full} />
                        <Tile description="Medals" placement={getPlacementToShow(myPlayer.placement.summary.medals)} value={getValueToShow(serviceRecord.summary.medals)} fullRanks={getAllRanks("summary", "medals")} gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.half} />
                        <Tile description="Betrayals" placement={getPlacementToShow(myPlayer.placement.summary.betrayals)} value={getValueToShow(serviceRecord.summary.betrayals)} fullRanks={getAllRanks("summary", "betrayals")} gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.half} lessIsBetter />
                        <Tile description="Suicides" placement={getPlacementToShow(myPlayer.placement.summary.suicides)} value={getValueToShow(serviceRecord.summary.suicides)} fullRanks={getAllRanks("summary", "suicides")} gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.half} lessIsBetter />
                        <Tile description="W-L-D" placement={getPlacementToShow(myPlayer.placement.winRate, true, true)} value={serviceRecord.breakdowns.matches.wins + "-" + serviceRecord.breakdowns.matches.losses + "-" + serviceRecord.breakdowns.matches.draws} fullRanks={getAllRanks("breakdowns", "matches", "wins")} noTooltip={view === SingleView.PerMatch || !filter.current.IsEmpty()} gamertag={gamertag} size={TileSize.full} />
                        <Tile description="Time Played" placement={getPlacementToShow(myPlayer.placement.timePlayed.seconds)} value={getValueToShow(serviceRecord.timePlayed.seconds)} isTime gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.full}></Tile>
                    </div>
                </div>
                <div className="right">
                    <div className="section">
                        <Tile description="Melee Kills" placement={getPlacementToShow(myPlayer.placement.breakdowns.kills.melee)} value={getValueToShow(serviceRecord.breakdowns.kills.melee)} fullRanks={getAllRanks("breakdowns", "kills", "melee")} tooltipPlacement="bottom" gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.firstFlat} />
                        <Tile description="Grenade Kills" placement={getPlacementToShow(myPlayer.placement.breakdowns.kills.grenades)} value={getValueToShow(serviceRecord.breakdowns.kills.grenades)} fullRanks={getAllRanks("breakdowns", "kills", "grenades")} tooltipPlacement="bottom" gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.flat} />
                        <Tile description="Headshots" placement={getPlacementToShow(myPlayer.placement.breakdowns.kills.headshots)} value={getValueToShow(serviceRecord.breakdowns.kills.headshots)} fullRanks={getAllRanks("breakdowns", "kills", "headshots")} tooltipPlacement="bottom" gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.flat} />
                        <Tile description="Power Weapons" placement={getPlacementToShow(myPlayer.placement.breakdowns.kills.powerWeapons)} value={getValueToShow(serviceRecord.breakdowns.kills.powerWeapons)} fullRanks={getAllRanks("breakdowns", "kills", "powerWeapons")} tooltipPlacement="bottom" gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.lastFlat} />
                    </div>
                    <div className="section">
                        <Tile description="EMP Assists" placement={getPlacementToShow(myPlayer.placement.breakdowns.assists.emp)} value={getValueToShow(serviceRecord.breakdowns.assists.emp)} fullRanks={getAllRanks("breakdowns", "assists", "emp")} tooltipPlacement="bottom" gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.firstFlat} />
                        <Tile description="Driver Assists" placement={getPlacementToShow(myPlayer.placement.breakdowns.assists.driver)} value={getValueToShow(serviceRecord.breakdowns.assists.driver)} fullRanks={getAllRanks("breakdowns", "assists", "driver")} tooltipPlacement="bottom" gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.flat} />
                        <Tile description="Callouts" placement={getPlacementToShow(myPlayer.placement.breakdowns.assists.callouts)} value={getValueToShow(serviceRecord.breakdowns.assists.callouts)} fullRanks={getAllRanks("breakdowns", "assists", "callouts")} tooltipPlacement="bottom" gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.lastFlat} />
                    </div>
                    <div className="section">
                        <Tile description="Shots Fired" placement={getPlacementToShow(myPlayer.placement.shots.fired)} value={getValueToShow(serviceRecord.shots.fired)} fullRanks={getAllRanks("shots", "fired")} tooltipPlacement="bottom" gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.firstFlat} />
                        <Tile description="Shots Missed" placement={getPlacementToShow(myPlayer.placement.shots.missed)} value={getValueToShow(serviceRecord.shots.missed)} fullRanks={getAllRanks("shots", "missed")} tooltipPlacement="bottom" gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.flat} lessIsBetter />
                        <Tile description="Shots Landed" placement={getPlacementToShow(myPlayer.placement.shots.landed)} value={getValueToShow(serviceRecord.shots.landed)} fullRanks={getAllRanks("shots", "landed")} tooltipPlacement="bottom" gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.flat} />
                        <Tile description="Total Accuracy" placement={getPlacementToShow(myPlayer.placement.shots.accuracy, true, true)} value={serviceRecord.shots.accuracy} fullRanks={getAllRanks("shots", "accuracy")} tooltipPlacement="bottom" noTooltip={view === SingleView.PerMatch || !filter.current.IsEmpty()} isPercent gamertag={gamertag} size={TileSize.lastFlat} />
                    </div>
                    <div className="section">
                        <Tile description="Damage Taken" placement={getPlacementToShow(myPlayer.placement.damage.taken)} value={getValueToShow(serviceRecord.damage.taken)} fullRanks={getAllRanks("damage", "taken")} tooltipPlacement="top" gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.firstFlat} lessIsBetter />
                        <Tile description="Damage Dealt" placement={getPlacementToShow(myPlayer.placement.damage.dealt)} value={getValueToShow(serviceRecord.damage.dealt)} fullRanks={getAllRanks("damage", "dealt")} tooltipPlacement="top" gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.lastFlat} />
                    </div>
                    <div className="section">
                        <Tile description="Vehicle Destroys" placement={getPlacementToShow(myPlayer.placement.summary.vehicles.destroys)} value={getValueToShow(serviceRecord.summary.vehicles.destroys)} fullRanks={getAllRanks("summary", "vehicles", "destroys")} tooltipPlacement="top" gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.firstFlat} />
                        <Tile description="Vehicle Hijacks" placement={getPlacementToShow(myPlayer.placement.summary.vehicles.hijacks)} value={getValueToShow(serviceRecord.summary.vehicles.hijacks)} fullRanks={getAllRanks("summary", "vehicles", "hijacks")} tooltipPlacement="top" gamertag={gamertag} noTooltip={!filter.current.IsEmpty()} size={TileSize.lastFlat} />
                    </div>
                </div>
            </div>
			<Footer lastUpdate={lastUpdate.current?.toLocaleString() ?? "N/A"} />
        </Box>
    );
}