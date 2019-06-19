/* eslint-disable import/first */

// mock setup, must come before AddressAutofillController import
jest.mock("./AddressSearchService", () => ({
    addressSearch: jest.fn(),
    NOT_FOUND_SEARCH_RESULT: jest.fn(),
}));
jest.mock("./AddressAutofillActions");
import { addressSearch, AddressSearchResult } from "./AddressSearchService";
import { updateAddress as updateAddressAction } from "./AddressAutofillActions";
const dispatch = jest.fn();

import { attemptAutofill } from "./AddressAutofillController";
import { Address } from "./Address";

function mockAddressSearchResult(
    addressSearchResult: object = {}
): AddressSearchResult {
    const defaultAddressSearchResult: AddressSearchResult = {
        address: {
            postcode: "6211",
        },
        foundMatch: true,
    };

    const mergedAddressSearchResult = {
        ...defaultAddressSearchResult,
        ...addressSearchResult,
    };

    // @ts-ignore
    addressSearch.mockReturnValue(mergedAddressSearchResult);

    return mergedAddressSearchResult;
}

function mockUpdateAddressAction() {
    const expectedAction = { Type: "DO_ACTION" };
    // @ts-ignore
    updateAddressAction.mockReturnValue(expectedAction);
    return expectedAction;
}

describe("AddressAutofillController", () => {
    describe("attemptAutofill", () => {
        it("should be able to be called with address object", () => {
            runAutoFill();
        });

        it("should return an address object", () => {
            const address: Address = runAutoFill();

            expect(address).toBeTruthy();
        });

        it("should call search service", () => {
            runAutoFill();

            expect(addressSearch).toHaveBeenCalledTimes(1);
            expect(addressSearch).toHaveBeenCalledWith(exampleAddressObject);
        });

        it("should pass the search result into the results parser", () => {
            const addressSearchResult = mockAddressSearchResult({
                foundMatch: true,
            });

            runAutoFill();

            expect(updateAddressAction).toHaveBeenCalledTimes(1);
            expect(updateAddressAction).toHaveBeenCalledWith(
                addressSearchResult.address
            );
        });

        it("should not pass the search result into the results parser if match not found", () => {
            mockAddressSearchResult({
                foundMatch: false,
            });

            runAutoFill();

            expect(updateAddressAction).toHaveBeenCalledTimes(0);
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
    });
    beforeEach(() => {
        jest.resetAllMocks();
    });
});

const exampleAddressObject: Address = {
    postcode: "6210",
};

const runAutoFill = (addressObject = exampleAddressObject) => {
    return attemptAutofill(dispatch)(addressObject);
};
