import { Box, Divider, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { ViewProps } from "../Props/ViewProps";
import { SRTabs } from "../../Assets/Components/Layout/AHDrawer";
import { HaloDotAPIStoreOffering } from "../../Database/Schemas/AutocodeMetadata";
import { Masonry } from "@mui/lab";
import { StoreOffer } from "./Components/StoreOffer";

import "../../Assets/Styles/Views/Store.css";
import { Debugger } from "../../Objects/Helpers/Debugger";

export function StoreView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, setBackgroundLoadingProgress, switchTab, setApiError } = props;
	//#endregion
	
	//#region State
	const [offerings, setOfferings] = useState<HaloDotAPIStoreOffering[]>([]);
	//#endregion

	/**
	 * Clears the loading messages
	 */
	const clearLoadingMessages = useCallback(() =>
	{
		setLoadingMessage("");
		setBackgroundLoadingProgress("");
	}, [setLoadingMessage, setBackgroundLoadingProgress]);

	/**
	 * Loads the store from HaloDotAPI
	 */
	const loadStore = useCallback(async () =>
	{
		if (offerings.length > 0) { return; }

		// Ensure we can update from HaloDotAPI
		if (!await app.CanUpdate()) 
		{ 
			setApiError(true); 
			return;
		}

		// Get the store
		const storeOfferings = await app.GetStore();
		
		setOfferings(storeOfferings);

	}, [app, offerings, setOfferings, setApiError]);

	/**
	 * Loads the data for the view
	 */
	const loadData = useCallback(async () => 
	{
		Debugger.LoadView("StoreView");
		
		// Update tab
		switchTab(undefined, SRTabs.Store);
		
		// Load and render store
		setLoadingMessage("Loading store");
		await loadStore();

		// Clear loading messages
		clearLoadingMessages();

	}, [switchTab, loadStore, setLoadingMessage, clearLoadingMessages]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Box component="main" className="pageContainer">
			<Helmet>
				<title>Spartan Record | Store</title>
				<meta name="description" content={"Current store items in Halo Infinite"} />
				<meta property="og:title" content="Spartan Record" />
            	<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/store`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box className="underToolbarContainer">
				<Masonry columns={{ xs: 1, sm: 3, xl: 4 }} spacing={2}>
					{offerings.map(offer => <StoreOffer offering={offer} />)}
				</Masonry>
			</Box>
		</Box>
	);
}