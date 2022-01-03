import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { ArrowheadFirebase } from "../Database/ArrowheadFirebase";

import { Header } from "../Assets/Components/Header";
import { Footer } from "../Assets/Components/Footer";

import { Player } from "../Objects/Model/Player";
import { Appearance } from "../Objects/Model/Appearance";
import { Halo5Converter } from "../Objects/Helpers/Halo5Converter";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import MedalTile from "../Tiles and Tables/MedalTile";

export function MedalsSummary(props: { arrowheadDB: ArrowheadFirebase })
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
	//#endregion

	//#region States
	const [myPlayer, setMyPlayer] = useState(new Player());
	const [loadingMessage, setLoadingMessage] = useState("");
	//#endregion

	//#region Functions
	//#endregion

	//#region Callbacks
	const goHome = useCallback(() =>
	{
		navigate("/");
	}, [navigate]);

	//#region Load Data
    const loadData = useCallback(async () => 
    {
        if (!gamertag) { return; }
		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Service Records");
		
        // Get last update instant
        await arrowheadDB.GetLastUpdate();
		lastUpdate.current = arrowheadDB.lastUpdate;

        setLoadingMessage("Loading " + gamertag);
        const serviceRecord = await arrowheadDB.GetCurrentServiceRecord(gamertag);
        if (!serviceRecord) 
        { 
            setLoadingMessage("");
            return; 
        }

        const player = new Player(gamertag);
        player.serviceRecord = serviceRecord;
        myPlayer.serviceRecord.medals.sort((a, b) => a.count < b.count ? 1 : -1);

        setLoadingMessage("Loading historic stats");
        player.historicStats = await arrowheadDB.GetHistoricServiceRecord(gamertag) ?? [];

        setLoadingMessage("Loading appearance");
        player.appearance = await arrowheadDB.GetAppearance(gamertag) ?? new Appearance();

        setMyPlayer(player); 
		setLoadingMessage("");

    }, [setMyPlayer, gamertag, lastUpdate, arrowheadDB, myPlayer]);
	//#endregion
	//#endregion

	//#region Effects
    useEffect(() =>
    {
        loadData();
    }, []);
	//#endregion
    
    return (
        <Box sx={{ flexGrow: 1, backgroundColor: "primary.dark", paddingTop: 10 }}>
            <Header title={myPlayer.gamertag} spartanRank={Halo5Converter.GetLevelFromScore(myPlayer.serviceRecord.totalScore)} leftImage={myPlayer.appearance.emblemURL} backdrop={myPlayer.appearance.backdropURL} subtitle={myPlayer.appearance.serviceTag} onArrowheadButtonClick={goHome} />
            <div className="split">
				<Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={!!loadingMessage}>
					<CircularProgress color="inherit" />
					<div className="loadingMessage">{loadingMessage}</div>
				</Backdrop>
                <div className="tileHolder">
                    <Card variant="outlined" sx={{ width: "100%", margin: 2, background: "transparent", borderColor: "#CCCCCC" }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }} color="white" gutterBottom>Normal Medals</Typography>
                            <Grid container spacing={2}>
                                {myPlayer.serviceRecord.medals.filter(medal => medal.rarity === "normal").map(medal => <MedalTile medal={medal} />)}
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ width: "100%", margin: 2, background: "transparent", borderColor: "#CCCCCC" }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }} color="white" gutterBottom>Heroic Medals</Typography>
                            <Grid container spacing={2}>
                                {myPlayer.serviceRecord.medals.filter(medal => medal.rarity === "heroic").map(medal => <MedalTile medal={medal} />)}
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ width: "100%", margin: 2, background: "transparent", borderColor: "#CCCCCC" }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }} color="white" gutterBottom>Legendary Medals</Typography>
                            <Grid container spacing={2}>
                                {myPlayer.serviceRecord.medals.filter(medal => medal.rarity === "lengendary").map(medal => <MedalTile medal={medal} />)}
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ width: "100%", margin: 2, background: "transparent", borderColor: "#CCCCCC" }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }} color="white" gutterBottom>Mythic Medals</Typography>
                            <Grid container spacing={2}>
                                {myPlayer.serviceRecord.medals.filter(medal => medal.rarity === "mythic").map(medal => <MedalTile medal={medal} />)}
                            </Grid>
                        </CardContent>
                    </Card>
                </div>
            </div>
			<Footer lastUpdate={lastUpdate.current?.toLocaleString() ?? "N/A"} />
        </Box>
    );
}