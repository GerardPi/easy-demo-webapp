import { createReducer } from "@reduxjs/toolkit";
import { defaultReadListSize } from "../../application-defaults";
import { reducerRegistry } from "../reducer-registry";
import * as addressbookActions from './actions';

const INITIAL_VALUES = {
    address: {
        readList: {
            content: [],
            pageIndex: 0,
            pageSize: defaultReadListSize
        },
        read: {
            id: null,
            content: null
        }
    }
};

const INITIAL_STATE = {
    address: INITIAL_VALUES.address
};

const reducer = createReducer(INITIAL_STATE, {
    [addressbookActions.address.read.command.type]: (state, action) => {
        state.address.read = INITIAL_VALUES.address.read;
        state.address.read.id = action.payload.id;
    },
    [addressbookActions.address.read.ok.type]: (state, action) => {
        state.address.read.content = action.payload.response.content;
    },
    [addressbookActions.address.readList.command.type]: (state, action) => {
        state.address.readList = INITIAL_VALUES.address.readList;
        state.address.readList.pageIndex = action.payload.pageIndex;
        state.address.readList.pageSize = action.payload.pageSize;
    },
    [addressbookActions.address.readList.ok.type]: (state, action) => {
        state.address.readList.content = action.payload.response.content;
        state.address.readList.pageIndex = action.payload.response.pageable.pageNumber;
        state.address.readList.pageSize = action.payload.response.pageable.pageSize;
    }
});

export const STORE_NAME = 'addressbook';

reducerRegistry.register(STORE_NAME);