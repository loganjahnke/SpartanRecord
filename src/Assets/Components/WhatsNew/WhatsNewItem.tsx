import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { Feature } from '../../../Objects/Model/Feature';

import AddIcon from '@mui/icons-material/Add';

interface WhatsNewItemProps
{
	feature: Feature;
}

export function WhatsNewItem(props: WhatsNewItemProps)
{
	const { feature } = props;
	
	return (
		<ListItem>
			<ListItemAvatar><Avatar><AddIcon /></Avatar></ListItemAvatar>
			<ListItemText primary={feature.primary} secondary={feature.secondary || undefined} />
		</ListItem>
	);
}