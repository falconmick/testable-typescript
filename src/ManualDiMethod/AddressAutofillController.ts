import {
    addressSearch,
    AddressSearchResult,
    NOT_FOUND_SEARCH_RESULT,
} from "./AddressSearchService";
import { updateAddress } from "./AddressAutofillActions";
import { Address } from "./Address";

// would move to a global declaration
// type AnyFunction = (...args: any[]) => any;

// type AddressSearchType = (Parameters<typeof addressSearch>) => ReturnType<addressSearch>
// type Parameters<T extends (...args: any) => any> = T extends (
//     ...args: infer P
// ) => any
//     ? P
//     : never;
//
// type ReturnType<T extends (...args: any) => any> = T extends (
//     ...args: any
// ) => infer R
//     ? R
//     : any;

type FunctionType<T extends (...args: any) => any> = T extends (
    ...args: Parameters<T>
) => ReturnType<T>
    ? T
    : any;

// All testable services are created with the following type
// type InjectableService = (...injectables: any[]) => (...args: any[]) => any;
// This is basically:
// function 1: List of injectables that returns another function
// function 2: Any function (this is our service)
//
// in the bellow example the injectables are addressSearch, updateAddress and some random json object
// next is the function which is the function which accepts a dispatch and returns another function
// this is acceptable as an InjectablService's second function's return value is any
// and thus another function is a.O.K!

export const __attemptAutofill = (
    _addressSearch: FunctionType<typeof addressSearch>,
    _updateAddress: FunctionType<typeof updateAddress>,
    _NOT_FOUND_SEARCH_RESULT: AddressSearchResult
) => (dispatch: (action: object) => void) => (address: Address): Address => {
    const { address: addressSearchResult, foundMatch } =
        _addressSearch(address) || _NOT_FOUND_SEARCH_RESULT;

    if (foundMatch) {
        dispatch(_updateAddress(addressSearchResult));
        return addressSearchResult;
    }

    return address;
};

export const attemptAutofill = __attemptAutofill(
    addressSearch,
    updateAddress,
    NOT_FOUND_SEARCH_RESULT
);
