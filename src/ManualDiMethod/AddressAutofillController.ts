import { AddressSearchResult, AddressSearchType } from "./AddressSearchService";
import { UpdateAddressType } from "./AddressAutofillActions";
import { Address } from "./Address";

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
    _addressSearch: AddressSearchType,
    _updateAddress: UpdateAddressType,
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

// This is how we do the manual DI, currently we don't have the
// dependencies defined so we cannot make it avaliable
// export const attemptAutofill = __attemptAutofill(
//     addressSearch,
//     updateAddress,
//     NOT_FOUND_SEARCH_RESULT
// );
// bellow shows how once you have setup the DI, the three dependancies would
// be defined normally in other files, but I am just making fake ones here
// so that we can see an example how how you would setup the DI
const exampleAddressSearchFnc: AddressSearchType = address => ({
    foundMatch: false,
    address: { postcode: "2222" },
});
const exampleAddressfnc: UpdateAddressType = address => ({});
const exampleAddressSearchResult: AddressSearchResult = {
    foundMatch: false,
    address: { postcode: "2222" },
};
export const attemptAutofill: ReturnType<
    typeof __attemptAutofill
> = __attemptAutofill(
    exampleAddressSearchFnc,
    exampleAddressfnc,
    exampleAddressSearchResult
);

// this is then how you would call the injected service
attemptAutofill(action => "my dispatcher")({ postcode: "example request!" });
