import { Address } from "./Address";

export interface AddressSearchResult {
    foundMatch: boolean;
    address: Address;
}

// to be used when substituting addressSearch, normally for tests OR for fallbacks
export const NOT_FOUND_SEARCH_RESULT: AddressSearchResult = {
    address: {},
    foundMatch: false,
};

export const addressSearch: AddressSearchType = address => ({
    address: {},
    foundMatch: false,
});

export type AddressSearchType = (address: Address) => AddressSearchResult;
