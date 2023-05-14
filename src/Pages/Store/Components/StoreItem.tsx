import { HaloDotAPIStoreItem, HaloDotAPIStoreOffering } from "../../../Database/Schemas/AutocodeMetadata";

import "../../../Assets/Styles/Views/Store.css";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Collapse, ImageList, ImageListItem, Typography } from "@mui/material";
import { CreditsIcon } from "../../../Assets/Icons/CustomIcons";
import { ArrowheadTheme } from "../../../Assets/Theme/ArrowheadTheme";
import { Search } from "@mui/icons-material";

interface StoreOfferProps
{
	item: HaloDotAPIStoreItem;
}

export function StoreItem(props: StoreOfferProps)
{
	const { item } = props;

	return (
		<ImageListItem>
			<img src={item.image_urls.item} alt={item.name} />
		</ImageListItem>
	);
}