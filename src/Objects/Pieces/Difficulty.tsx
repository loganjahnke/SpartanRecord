export class Difficulty
{
    highestCompleted: string;
    highestCompletedImage: string;
    lasoCompleted: boolean;

    constructor(data?: any)
    {
        this.highestCompleted = data?.highest_completed;
        this.highestCompletedImage = data?.highest_completed_image_url;
        this.lasoCompleted = data?.laso_completed;
    }
}