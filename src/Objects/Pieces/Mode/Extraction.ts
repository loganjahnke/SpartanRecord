import { ExtractionSchema } from "../../../Database/Schemas/ServiceRecordSchema";

export class Extraction
{
	public extraction_conversions_completed: number = 0;
	public extraction_conversions_denied: number  = 0;
	public extraction_initiations_completed: number  = 0;
	public extraction_initiations_denied: number  = 0;
	public successful_extractions: number  = 0;

	constructor(data?: ExtractionSchema)
	{
		if (!data) { return; }
		this.extraction_conversions_completed = data.extraction_conversions_completed;
		this.extraction_conversions_denied = data.extraction_conversions_denied;
		this.extraction_initiations_completed = data.extraction_initiations_completed;
		this.extraction_initiations_denied = data.extraction_initiations_denied;
		this.successful_extractions = data.successful_extractions;
	}

	/**
     * Adds a Extraction to this Extraction
     * @param other the other Extraction
     */
	public add(other: Extraction): void
	{
		if (!other) { return; }
		this.extraction_conversions_completed += other.extraction_conversions_completed;
		this.extraction_conversions_denied += other.extraction_conversions_denied;
		this.extraction_initiations_completed += other.extraction_initiations_completed;
		this.extraction_initiations_denied += other.extraction_initiations_denied;
		this.successful_extractions += other.successful_extractions;
	}
}