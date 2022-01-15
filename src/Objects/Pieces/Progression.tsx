import { CSRS } from "../Model/CSRS";

export class Progression
{
    pre: CSRS;
    post: CSRS;

    constructor(data?: any)
    {
        this.pre = new CSRS(data?.csr?.pre_match);
        this.post = new CSRS(data?.csr?.post_match);
    }
}