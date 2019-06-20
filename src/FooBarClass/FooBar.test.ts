import { IFooBar, FooBar } from "./FooBar";
import { IFoo } from "./Foo";
import { IBar } from "./Bar";
import { Arg, Substitute, SubstituteOf } from "@fluffy-spoon/substitute";
import {IBarNester} from "./BarNester";

type Mock<T> = jest.Mock<T> & T;
type ValueMock<T> = jest.Mock<T> | any;

// example of how to Mock Interfaces via jest.fn
const exampleMock: IFoo = {
    CallFoo: jest.fn(),
};

/*

Notes comparing Class based services VS curried function based classes (The original FooBar)

1. currently I cannot find a good way to use jest.fn() based mocking, see exampleMock above
basically, you are required to define an implementation of the interface with each function
manually mocked. I would really want to fix this if we chose this moving forward as the
Fluffy spoon mocking library (Nsubstitute clone) isn't as big as jest.fn() and I would hate
to discover it had some bad bugs.
2. @fluffy-spoon/substitute currently doesn't support automatic deep mocking as par NSubstitute
see issue: https://github.com/ffMathy/FluffySpoon.JavaScript.Testing.Faking/issues/54
That being said, no reason why I couldn't look into using ReturnType<typeof theMethodWeAreMockin>
This will be hard to make.
3. We won't be able to use this for the react components (but hey, maybe we want that distinction
4. Interface Class feel is more natural as a C# Dev
 */

describe("FooBar", () => {
    describe("Testing @fluffy-spoon/substitute", () => {
        // #### this fails because it's not supported
        it("Should be compatible with auto-mocking nested items", () => {
            const barNest = Substitute.for<IBarNester>();

            // @ts-ignore // currently not sure how to handle the ts error on returns(
            barNest.WooWWeeSomeBar().CallBar(Arg.any()).returns('magic');

            expect(barNest.WooWWeeSomeBar().CallBar('foo')).toEqual('magic')
        })

        // #### this fails because it's not supported
        it("Should be compatible with auto-mocking nested items which have param", () => {
            const barNest = Substitute.for<IBarNester>();

            // @ts-ignore // currently not sure how to handle the ts error on returns(
            barNest.WooWWeeSomeBarWithParam(Arg.any()).CallBar(Arg.any()).returns('magic');

            expect(barNest.WooWWeeSomeBarWithParam("wow").CallBar('foo')).toEqual('magic')
        })

        it("can handle manual deep mocks", () => {
            const barNest = Substitute.for<IBarNester>();
            const barSubstitute = Substitute.for<IBar>();

            // @ts-ignore // currently not sure how to handle the ts error on returns(
            barNest.WooWWeeSomeBar().returns(barSubstitute);
            barSubstitute.CallBar(Arg.any()).returns('magic')

            expect(barNest.WooWWeeSomeBar().CallBar('foo')).toEqual('magic')
        })
    })
    describe("helloFoo", () => {
        let _foo: SubstituteOf<IFoo>;
        let _bar: SubstituteOf<IBar>;

        let _helloFoo: IFooBar;

        it("should have a function we can call", () => {
            runTest();
        });

        it("should return a string", () => {
            // _bar.CallBar.mockReturnValue('sorry')
            _bar.CallBar(Arg.any()).returns("sorry");
            // we still need to define the returns because unlike NSubstitute
            // this library doesn't return the default it returns a func if
            // nothing is setup
            // error message you get:
            /*
                Error: expect(received).toEqual(expected) // deep equality

                Expected: "string"
                Received: "function"
             */

            expect(typeof runTest()).toEqual("string");
        });

        it("should call foo once", () => {
            runTest();

            // expect(_foo).toHaveBeenCalledTimes(1);
            _foo.received(1).CallFoo(Arg.any());
        });

        it("should pass the hello param into foo", () => {
            const fooParam = "string";

            runTest(fooParam);

            // expect(_foo).toHaveBeenCalledWith(fooParam);
            _foo.received().CallFoo(fooParam);
        });

        it("should call bar once", () => {
            runTest();

            // expect(_bar).toHaveBeenCalledTimes(1);
            _bar.received(1).CallBar(Arg.any());
        });

        it("should pass the return of foo into bar", () => {
            const fooResult = "fooResult";
            // _foo.mockReturnValue(fooResult);
            _foo.CallFoo(Arg.any()).returns(fooResult);

            runTest();

            // expect(_bar).toHaveBeenCalledWith(fooResult);
            _bar.received().CallBar(fooResult);
        });

        it("should return the result of bar to the caller", () => {
            const barResult = "bar result";
            // _bar.mockReturnValue(barResult);
            _bar.CallBar(Arg.any()).returns(barResult);

            const result = runTest();

            expect(result).toBe(barResult);
        });

        beforeEach(() => {
            _foo = Substitute.for<IFoo>();
            _bar = Substitute.for<IBar>();

            _helloFoo = new FooBar(_foo, _bar);
        });

        function runTest(hello: string = "Hello") {
            return _helloFoo.DoSomeFooBar(hello);
        }
    });
});
