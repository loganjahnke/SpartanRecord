interface ImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
{
	fallback?: string;
}

/**
 * An image HTML element with fallback handling
 * @param props the image props + optional fallback
 * @returns the image element
 */
export function Image(props: ImageProps)
{
	const imgProps = props as React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

	const onError = (event: React.SyntheticEvent<HTMLImageElement, Event>) =>
	{
		event.currentTarget.src = props.fallback || "https://spartanrecord.com/images/SwordsIco.png";
	};

	return <img alt="Spartan Record" {...imgProps} onError={onError} crossOrigin="anonymous" />
}