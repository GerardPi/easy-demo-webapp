import { createReducer } from "@reduxjs/toolkit";
import { defaultReadListSize } from "../../application-defaults";
import { reducerRegistry } from "../reducer-registry";
import * as addressbookActions from './actions';

const INITIAL_VALUES = {
    address: {
        one: {
            id: null,
            content: null
        },
        list: {
            content: [],
            pageIndex: 0,
            pageSize: defaultReadListSize
        }
    }
};

const INITIAL_STATE = {
    address: INITIAL_VALUES.address
};

const reducer = createReducer(INITIAL_STATE, {
    [addressbookActions.address.read.command.type]: (state, action) => {
        state.address.one = INITIAL_VALUES.address.one;
        state.address.one.id = action.payload.id;
    },
    [addressbookActions.address.read.ok.type]: (state, action) => {
        state.address.one.content = action.payload.response.content;
    },
    [addressbookActions.address.readList.command.type]: (state, action) => {
        state.address.list = INITIAL_VALUES.address.list;
        state.address.list.pageIndex = action.payload.pageIndex;
        state.address.list.pageSize = action.payload.pageSize;
    },
    [addressbookActions.address.readList.ok.type]: (state, action) => {
        state.address.list.content = action.payload.response.content;
        state.address.list.pageIndex = action.payload.response.pageable.pageNumber;
        state.address.list.pageSize = action.payload.response.pageable.pageSize;
    },
    [addressbookActions.person.read.command.type]: (state, action) => {
        state.person.one = INITIAL_VALUES.person.one;
        state.person.one.id = action.payload.id;
    },
    [addressbookActions.person.read.ok.type]: (state, action) => {
        state.person.one.content = action.payload.response.content;
    },
    [addressbookActions.person.readList.command.type]: (state, action) => {
        state.person.list = INITIAL_VALUES.person.list;
        state.person.list.pageIndex = action.payload.pageIndex;
        state.person.list.pageSize = action.payload.pageSize;
    },
    [addressbookActions.person.readList.ok.type]: (state, action) => {
        state.person.list.content = action.payload.response.content;
        state.person.list.pageIndex = action.payload.response.pageable.pageNumber;
        state.person.list.pageSize = action.payload.response.pageable.pageSize;
    }
});

export const STORE_NAME = 'addressbook';

reducerRegistry.register(STORE_NAME, reducer);
