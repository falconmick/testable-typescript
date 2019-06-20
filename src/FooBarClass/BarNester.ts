import {IBar} from "./Bar";

export interface IBarNester {
    WooWWeeSomeBar(): IBar;
    WooWWeeSomeBarWithParam(str: string): IBar;
}