import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import React from 'react';
import { styled } from '@mui/material/styles';

import '../Assets/FontAwesome/css/all.css';
import '../Assets/Styles/Tiles/Tile.css';

export enum TileSize
{
    half = "half", 
    full = "full",
    flat = "flat",
    firstFlat = "firstFlat",
    lastFlat = "lastFlat"
}

interface TileProps
{
    /** The rank of the statistic in reference to the other Arrowhead members */
    placement?: number;
    /** The name of the description */
    description: string;
    /** The value */
    value: number | string;
    /** The size of the tile */
    size: TileSize;
	/** Placement of the tooltip */
	tooltipPlacement?: "bottom" | "bottom-end" | "bottom-start" | "left-end" | "left-start" | "left" | "right-end" | "right-start" | "right" | "top-end" | "top-start" | "top" | undefined;
	/** Comparison points for the value */
	fullRanks?: { gamertag: string, value: number | string }[];
	/** My gamertag */
	gamertag?: string;
    /** Is this a percentage? */
    isPercent?: boolean;
    /** Is this a time in seconds? */
    isTime?: boolean;
	/** If true, hides the tooltip */
	noTooltip?: boolean;
	/** Less is better? */
	lessIsBetter?: boolean;
}

const Tile = (props: TileProps) =>
{
    const { placement, description, value, size, isPercent, isTime, tooltipPlacement, fullRanks, noTooltip, lessIsBetter, gamertag } = props;
    
	let tooltipPosition = tooltipPlacement;
	if (!tooltipPosition) { tooltipPosition = "bottom"; }

	let color = "";
	let place = -1;
	if (placement)
	{
		place = lessIsBetter ? 7 - placement : placement;
		if (place === 1) { color = "green"; }
		if (place === 5) { color = "red"; }
	}

    let rank: any;
    if (placement && place === 1) { rank = <i className="fas fa-trophy"></i>; }
    else if (placement) { rank = "#" + place; }

    function makeTimeReadable(seconds: number)
    {
        const numdays = Math.floor((seconds % 31536000) / 86400); 
        const numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
        const numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
        const numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;

        let daysStr = "";
        const timeStr = numhours > 0 
            ? numhours + "h " + numminutes + "m " + numseconds + "s"
            : numminutes + "m " + numseconds + "s";

        if (numdays > 0)
        {
            daysStr = numdays + "d ";
        }

        return daysStr + timeStr;
    }

	//#region Content
	const mainContent = (
		<div className={`tile ${size}`}>
			<div className="action">
				<span className="statTitle">{description}</span>
				{ isTime 
					? <span className="statValue">{makeTimeReadable(Math.round(value as number))}</span> 
					: <span className="statValue">{typeof value === "number" ? (Math.round(value * 100) / 100).toLocaleString() : value}{isPercent ? "%" : ""}</span>
				}
				{noTooltip ? undefined : <span className={`placement ${color}`}>{rank}</span>}
			</div>
		</div>
	);
	
	if (noTooltip || !fullRanks) { return mainContent; }
	if (!lessIsBetter)
	{
		fullRanks.sort((a, b) => a.value > b.value ? -1 : 1);
	}
	else 
	{
		fullRanks.sort((a, b) => a.value > b.value ? 1 : -1);
	}

	/**
	 * InlineRank used for the HTMLTooltip
	 * @param props contains rank and placement
	 * @returns React Element
	 */
	function InlineRank(props: { rank: { gamertag: string, value: number | string }, placement: number }): React.ReactElement
	{
		const { rank, placement } = props;
		if (!rank || !rank.gamertag) { return <div></div>; }
		const v = rank.value;
		
		return (
			<div className={"tileRow"}>
				<div className={rank.gamertag === gamertag ? "myAction" : "action"}>
					<span className={`placement`}>#{placement}</span>
					<span className="statTitle">{rank.gamertag}</span>
					{ isTime 
						? <span className="statValue">{makeTimeReadable(Math.round(v as number))}</span> 
						: <span className="statValue">{typeof v === "number" ? (Math.round(v * 100) / 100).toLocaleString() : v}{isPercent ? "%" : ""}</span>
					}
				</div>
			</div>
		);
	}

	const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (<Tooltip {...props} classes={{ popper: className }} />))(({ theme }) => ({
		[`& .${tooltipClasses.arrow}`]: {
			color: theme.palette.common.black,
		},
		[`& .${tooltipClasses.tooltip}`]: {
			backgroundColor: theme.palette.common.black,
			color: 'rgba(0, 0, 0, 0.87)',
			maxWidth: 220,
			fontSize: theme.typography.pxToRem(12)
		},
	}));
	
	return (
		<HtmlTooltip disableFocusListener arrow placement={tooltipPosition} enterTouchDelay={0} title={
			<div>
				{fullRanks.map((rank, index) => index > 4 ? undefined : <InlineRank rank={rank} placement={index + 1} />)}
			</div>
		}>
            {mainContent}
        </HtmlTooltip>
    );
	//#endregion
}

export default Tile;