import {__helloFoo} from "./FooBar";
import {FooFunctionType} from "./Foo";
import {BarFunctionType} from "./Bar";


type Mock<T extends (...args: any) => any> = jest.Mock<
    ReturnType<T>,
    Parameters<T>
    > &
    T;
type ValueMock<T> = jest.Mock<T> | any;

describe("FooBar", () => {
    describe("__helloFoo", () => {
        let _foo: Mock<FooFunctionType>;
        let _bar: Mock<BarFunctionType>;

        let _helloFooInjected: ReturnType<typeof __helloFoo>;

        it('should have a function we can call', () => {
            runTest();
        });

        it('should return a string', () => {
            _bar.mockReturnValue('sorry')

            expect(typeof runTest()).toEqual('string')
        });

        it('should call foo once', () => {
            runTest();

            expect(_foo).toHaveBeenCalledTimes(1);
        });

        it('should pass the hello param into foo', () => {
            const fooParam = 'string';

            runTest(fooParam);

            expect(_foo).toHaveBeenCalledWith(fooParam);
        });

        it('should call bar once', () => {
            runTest();

            expect(_bar).toHaveBeenCalledTimes(1);
        })

        it('should pass the return of foo into bar', () => {
            const fooResult = 'fooResult';
            _foo.mockReturnValue(fooResult);

            runTest();

            expect(_bar).toHaveBeenCalledWith(fooResult);
        })

        it('should return the result of bar to the caller', () => {
            const barResult = 'bar result';
            _bar.mockReturnValue(barResult);

            const result = runTest();

            expect(result).toBe(barResult)
        })

        beforeEach(() => {
            _foo = jest.fn();
            _bar = jest.fn();

            _helloFooInjected = __helloFoo(_foo, _bar);
        });


        function runTest(hello: string = 'Hello') {
            return _helloFooInjected(hello);
        }
    });
});

