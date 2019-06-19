import { addressSearch, NOT_FOUND_SEARCH_RESULT } from "./AddressSearchService";
import { updateAddress } from "./AddressAutofillActions";
import { Address } from "./Address";

export const attemptAutofill = (dispatch: (action: object) => void) => (
    address: Address
): Address => {
    const { address: addressSearchResult, foundMatch } =
        addressSearch(address) || NOT_FOUND_SEARCH_RESULT;

    if (foundMatch) {
        dispatch(updateAddress(addressSearchResult));
        return addressSearchResult;
    }

    return address;
};
