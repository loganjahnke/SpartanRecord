import { Rank } from "../Model/CSRS";

export class Progression
{
    pre: Rank;
    post: Rank;

    constructor(data?: any)
    {
        this.pre = new Rank(data?.csr?.pre_match);
        this.post = new Rank(data?.csr?.post_match);
    }
}