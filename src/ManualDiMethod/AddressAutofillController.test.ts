import { addressSearch, AddressSearchResult } from "./AddressSearchService";
import { Address } from "./Address";
import * as AddressAutofillController from "./AddressAutofillController";
import { updateAddress } from "./AddressAutofillActions";

const dispatch = jest.fn();

type FunctionType<T extends (...args: any) => any> = T extends (
    ...args: Parameters<T>
) => ReturnType<T>
    ? T
    : any;

type Mock<T> = jest.Mock<T> & T;
type ValueMock<T> = jest.Mock<T> | any;

describe("AddressAutofillController", () => {
    describe("attemptAutofill", () => {
        // injectables
        let _addressSearch: Mock<typeof addressSearch>;
        let _updateAddressAction: Mock<typeof updateAddress>;
        let _NOT_FOUND_SEARCH_RESULT: ValueMock<AddressSearchResult>;

        // unit we are testing
        let attemptAutofill: FunctionType<
            typeof AddressAutofillController.attemptAutofill
        >;

        // equivalent to the SetUp function for nunit
        beforeEach(() => {
            _addressSearch = jest.fn();
            _updateAddressAction = jest.fn();
            _NOT_FOUND_SEARCH_RESULT = jest.fn();

            // need implicit conversion to any as jest.fn()'s type cannot
            // be directly consumed by __attemptAutofill as I'm not quite
            // sure how to
            attemptAutofill = AddressAutofillController.__attemptAutofill(
                _addressSearch,
                _updateAddressAction,
                _NOT_FOUND_SEARCH_RESULT
            );
        });

        it("should be able to be called with address object", () => {
            runAutoFill();
        });

        it("should return an address object", () => {
            const address: Address = runAutoFill();

            expect(address).toBeTruthy();
        });

        it("should call search service", () => {
            runAutoFill();

            expect(_addressSearch).toHaveBeenCalledTimes(1);
            expect(_addressSearch).toHaveBeenCalledWith(exampleAddressObject);
        });

        it("should pass the search result into the results parser", () => {
            const addressSearchResult = mockAddressSearchResult({
                foundMatch: true,
            });

            runAutoFill();

            expect(_updateAddressAction).toHaveBeenCalledTimes(1);
            expect(_updateAddressAction).toHaveBeenCalledWith(
                addressSearchResult.address
            );
        });

        it("should not pass the search result into the results parser if match not found", () => {
            mockAddressSearchResult({
                foundMatch: false,
            });

            runAutoFill();

            expect(_updateAddressAction).toHaveBeenCalledTimes(0);
        });

        it("should dispatch the action result if search result found", () => {
            mockAddressSearchResult({
                foundMatch: true,
            });
            const expectedAction = mockUpdateAddressAction();

            runAutoFill();

            expect(dispatch).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(expectedAction);
        });

        it("should not dispatch the action result if search result not found", () => {
            mockAddressSearchResult({
                foundMatch: false,
            });
            mockUpdateAddressAction();

            runAutoFill();

            expect(dispatch).toHaveBeenCalledTimes(0);
        });

        it("should return the new address result if match found", () => {
            const resultAddress = mockAddressSearchResult({
                foundMatch: true,
            });

            const result: Address = runAutoFill();

            expect(result).toBe(resultAddress.address);
        });

        it("should return the original address if match not found", () => {
            mockAddressSearchResult({
                foundMatch: false,
            });

            // definition of return type important here as it
            // allows TS to break this test if we change this
            const result: Address = runAutoFill(exampleAddressObject);

            expect(result).toBe(exampleAddressObject);
        });

        function runAutoFill(addressObject = exampleAddressObject) {
            return attemptAutofill(dispatch)(addressObject);
        }

        function mockAddressSearchResult(
            addressSearchResult: Partial<AddressSearchResult> = {}
        ): AddressSearchResult {
            const defaultAddressSearchResult: AddressSearchResult = {
                address: {
                    postcode: "6211",
                },
                foundMatch: true,
            };

            const mergedAddressSearchResult: AddressSearchResult = {
                ...defaultAddressSearchResult,
                ...addressSearchResult,
            };

            _addressSearch.mockReturnValue(mergedAddressSearchResult);

            return mergedAddressSearchResult;
        }

        function mockUpdateAddressAction() {
            const expectedAction = { Type: "DO_ACTION" };
            _updateAddressAction.mockReturnValue(expectedAction);
            return expectedAction;
        }
    });

    // this is scoped to the entire suit and will be ran before each test
    // including those inside of other describe scopes.
    beforeEach(() => {
        // undoes any mockReturnValue and counters changed inside of the scope of the test
        // todo: figure out way to reset mocks without destroying custom setuo
        // inside of the jest.mock calls
        jest.resetAllMocks();
    });
});

const exampleAddressObject: Address = {
    postcode: "6210",
};
