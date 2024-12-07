import { Typography, Box } from "@mui/material";
import React, { useEffect, useState } from "react";

interface GrowBoxProps
{
	content: string | JSX.Element | JSX.Element[];
	duration?: string;
	delay?: string;
	nested?: boolean;
}

interface InnerGrowBoxProps
{
	content: string | JSX.Element | JSX.Element[];
	style?: any;
	nested?: boolean;
}

/**
 * A component to wrap a component around a max-height growth animation
 */
export function GrowBox(props: GrowBoxProps)
{
	const { content, duration = "2s", delay, nested } = props;

	const [maxHeight, setMaxHeight] = useState("0px");
	const [hidden, setHidden] = useState(nested);

	useEffect(() =>
	{
		const timeoutId = setTimeout(() =>
		{
			setHidden(false);
			setMaxHeight("1000px");
		}, parseInt(delay ?? "2000"));

		return () => clearTimeout(timeoutId);
	}, []); // eslint-disable-line

	return (
		<Box style={{ width: "100%", visibility: hidden ? "hidden" : "visible", maxHeight: maxHeight, transition: "max-height ease-in-out", transitionDuration: duration }}>
			<GrowBoxInner content={content} nested={nested} />
		</Box>
	);
}

/**
 * The inner component to grow into
 */
const GrowBoxInner = React.forwardRef(function (props: InnerGrowBoxProps, ref)
{
	const { content, nested } = props;

	let withoutContent = { style: props.style };

	return (
		<Box ref={ref} {...withoutContent} sx={{ backgroundColor: nested ? "transparent" : "divider", borderRadius: 3, display: "flex", flexDirection: "column", textAlign: "center", justifyContent: "space-evenly", alignItems: "center", p: nested ? 0 : 2 }}>
			{typeof content === "string" 
				? <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: "1px" }}>{content}</Typography> 
				: content
			}
		</Box>
	);
})