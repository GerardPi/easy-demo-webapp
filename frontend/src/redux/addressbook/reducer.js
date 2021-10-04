import * as reduxToolkit from '@reduxjs/toolkit';
import applicationDefaults from '../../application-defaults';
import addressbookActions from './actions';

const INITIAL_VALUES = {
    address: {
        one: {
            id: null,
            item: null
        },
        list: {
            items: [],
            pageIndex: 0,
            pageSize: applicationDefaults.pageSize
        }
    }
};

const INITIAL_STATE = {
    address: INITIAL_VALUES.address
};

const reducer = reduxToolkit.createReducer(INITIAL_STATE, {
    [addressbookActions.address.read.command.type]: (state, action) => {
        state.address.one.item = INITIAL_VALUES.address.one.item;
        state.address.one.id = action.payload.id;
    },
    [addressbookActions.address.read.ok.type]: (state, action) => {
        state.address.one.item = action.payload.response.content;
    },
    [addressbookActions.address.readList.command.type]: (state, action) => {
        state.address.list.items = INITIAL_VALUES.address.list.items;
        state.address.list.pageIndex = action.payload.pageIndex;
        state.address.list.pageSize = action.payload.pageSize;
    },
    [addressbookActions.address.readList.ok.type]: (state, action) => {
        state.address.list.items = action.payload.response.content;
        state.address.list.pageIndex = action.payload.response.pageable.page;
        state.address.list.pageSize = action.payload.response.pageable.size;
    },
    [addressbookActions.person.read.command.type]: (state, action) => {
        state.person.one.item = INITIAL_VALUES.person.one.item;
        state.person.one.id = action.payload.id;
    },
    [addressbookActions.person.read.ok.type]: (state, action) => {
        state.person.one.item = action.payload.response.content;
    },
    [addressbookActions.person.readList.command.type]: (state, action) => {
        state.person.list.items = INITIAL_VALUES.person.list.items;
        state.person.list.pageIndex = action.payload.pageIndex;
        state.person.list.pageSize = action.payload.pageSize;
    },
    [addressbookActions.person.readList.ok.type]: (state, action) => {
        state.person.list.items = action.payload.response.content;
        state.person.list.pageIndex = action.payload.response.pageable.page;
        state.person.list.pageSize = action.payload.response.pageable.size;
    }
});

export default reducer;
