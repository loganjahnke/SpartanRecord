import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { InnerAnimationBox } from "./Shared/InnerAnimationBox";
import { AnimationProps } from "./Shared/AnimationProps";

/**
 * A component to wrap a component around a max-height growth animation
 */
export function GrowBox(props: AnimationProps)
{
	const { duration = "2s", delay = "250ms", nested } = props;

	const [maxHeight, setMaxHeight] = useState("0px");
	const [hidden, setHidden] = useState(nested);

	useEffect(() =>
	{
		const timeoutId = setTimeout(() =>
		{
			setHidden(false);
			setMaxHeight("1000px");
		}, parseInt(delay));

		return () => clearTimeout(timeoutId);
	}, []); // eslint-disable-line

	return (
		<Box style={{ width: "100%", visibility: hidden ? "hidden" : "visible", maxHeight: maxHeight, transition: "max-height ease-in-out", transitionDuration: duration }}>
			<InnerAnimationBox {...props} />
		</Box>
	);
}