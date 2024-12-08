export interface AnimationProps
{
	content: string | JSX.Element | JSX.Element[];
	duration?: string;
	delay?: string;
	nested?: boolean;
	ignoreBoxStyling?: boolean;
}