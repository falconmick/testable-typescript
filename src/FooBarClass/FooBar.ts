import { IFoo } from "./Foo";
import { IBar } from "./Bar";

export interface IFooBar {
    DoSomeFooBar(hello: string): string;
}

export class FooBar implements IFooBar {
    constructor(private _foo: IFoo, private _bar: IBar) {}
    DoSomeFooBar(hello: string): string {
        const fooResult: string = this._foo.CallFoo(hello);
        const fooBarResult: string = this._bar.CallBar(fooResult);
        return fooBarResult;
    }
}
