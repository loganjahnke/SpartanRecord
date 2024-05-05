import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { Feature } from '../../../Objects/Model/Feature';

import LaunchIcon from '@mui/icons-material/Launch';
import AddIcon from '@mui/icons-material/Add';

import "../../Styles/Components/WhatsNew.css";

interface WhatsNewItemProps
{
	feature: Feature;
	onJump: (to: string) => void;
}

export function WhatsNewItem(props: WhatsNewItemProps)
{
	const { feature, onJump } = props;
	
	return (
		<ListItem className={!!feature?.jumpTo ? "whatsNewJump" : "whatsNew"} onClick={!!feature?.jumpTo ? () => onJump(feature.jumpTo!) : undefined}>
			<ListItemAvatar>
				<Avatar>{!!feature?.jumpTo ? <LaunchIcon /> : <AddIcon />}</Avatar>
			</ListItemAvatar>
			<ListItemText primary={feature.primary} secondary={feature.secondary || undefined} />
		</ListItem>
	);
}