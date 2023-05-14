import { HaloDotAPIStoreOffering } from "../../../Database/Schemas/AutocodeMetadata";

import "../../../Assets/Styles/Views/Store.css";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Collapse, ImageList, Typography } from "@mui/material";
import { CreditsIcon } from "../../../Assets/Icons/CustomIcons";
import { ArrowheadTheme } from "../../../Assets/Theme/ArrowheadTheme";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { StoreItem } from "./StoreItem";
import { useState } from "react";

interface StoreOfferProps
{
	offering: HaloDotAPIStoreOffering;
}

export function StoreOffer(props: StoreOfferProps)
{
	const { offering } = props;

	const [expanded, setExpanded] = useState(false);

	let color = ArrowheadTheme.card;
	switch (offering.attributes.quality)
	{
		case "legendary":
			color = "radial-gradient(62.39% 62.39% at 50% 50%, rgb(222, 167, 54) 0%, rgb(104, 75, 15) 100%)";
			break;
		case "epic":
			color = "radial-gradient(61.06% 61.06% at 50% 50%, rgb(133, 95, 164) 0%, rgb(72, 34, 103) 100%)";
			break;
		case "common":
			color = "radial-gradient(64.16% 64.16% at 50% 50%, rgb(113, 113, 113) 0%, rgb(53, 53, 53) 100%)";
			break;
	}

	return (
		<Card>
			<CardMedia component="img" image={offering.image_urls.offering} sx={{ background: color }} />
			<CardContent>
				<Box className="_storeCardContent">
					<Box className="_storeName">
						<Typography variant="h5">{offering.name}</Typography>
						<Typography variant="subtitle1">{offering.description}</Typography>
					</Box>
					<Box className="_storeCost">
						<CreditsIcon className="_storeCreditIcon" />
						{offering.prices[0].properties.cost}
					</Box>
				</Box>
			</CardContent>
			<CardActions>
				<Button size="small" startIcon={<CreditsIcon />} onClick={() => window.open("https://www.halowaypoint.com/halo-infinite/store/details/main/" + offering.id)}>Buy</Button>
				{offering.items.length > 0 && <Button size="small" startIcon={expanded ? <ArrowUpward /> : <ArrowDownward />} onClick={() => setExpanded(!expanded)}>{expanded ? "Collapse" : "Inspect"}</Button>}
			</CardActions>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>
					<ImageList>
						{offering.items.map(item => <StoreItem item={item} />)}
					</ImageList>
				</CardContent>
			</Collapse>
		</Card>
	);
}