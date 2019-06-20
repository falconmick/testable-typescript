import { FooFunctionType } from "./Foo";
import { BarFunctionType } from "./Bar";

export const __helloFoo = (_foo: FooFunctionType, _bar: BarFunctionType) => (
    hello: string
): string => {
    const fooResult: string = _foo(hello);
    const fooBarResult: string = _bar(fooResult);
    return fooBarResult;
};

const mockFooFunction: FooFunctionType = fooParam => '';
const barFooFunction: BarFunctionType = fooParam => '';

export const helloFoo = __helloFoo(mockFooFunction, barFooFunction);

const result: string = helloFoo('test');