import { SpartanCompany } from "./SpartanCompany";
import { Player } from "./Player";
import { User } from "firebase/auth";

export class ArrowheadUser
{
    public spartanCompany?: SpartanCompany;
    public player?: Player;
    public user?: User;

    constructor(user?: User | null)
    {
        this.user = user ?? undefined;
    }
}