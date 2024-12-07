import { GridItemCentered } from "../../Common/GridItemCentered";
import { ImageCardWithContent } from "../../Cards/ImageCardWithContent";
import { PlayerCard } from "../../PlayerAppearance/PlayerCard";
import { Player } from "../../../../Objects/Model/Player";

interface PlayerCardCalloutProps
{
	player?: Player;
}

/**
 * A component to wrap text around a zoom animation
 */
export function PlayerCardCallout(props: PlayerCardCalloutProps)
{
	const { player } = props;

	return (
		<GridItemCentered>
			<ImageCardWithContent autoHeight maxWidth>
				<PlayerCard player={player} topDown ultraLarge />
			</ImageCardWithContent>
		</GridItemCentered>
	);
}