import { HaloDotAPIStoreItem } from "../../../Database/Schemas/AutocodeMetadata";

import "../../../Assets/Styles/Views/Store.css";
import { ImageListItem } from "@mui/material";

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