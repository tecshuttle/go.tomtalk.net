import {combineReducers} from 'redux'

/******************** Memo Reducer ***********************/
const memoList = (state = {isFetching: false, items: []}, action) => {
    switch (action.type) {
        case 'REQUEST_MEMO':
            return {...state, isFetching: true};
        case 'RECEIVE_MEMO':
            return {...state, items: action.data};
        case 'ADD_MEMO':
            return {...state, items: [...state.items, state.items.length + 1]};
        case 'UPDATE_MEMO':
            return {
                ...state,
                items: state.items.map(
                    item => (item.id === action.values.id) ?
                        {
                            ...item,
                            question: action.values.question,
                            answer: action.values.answer,
                        }
                        : item
                )
            };
        case 'DELETE_MEMO_ITEM':
            for (var i in state.items) {
                if (state.items[i].id === action.id) {
                    return {
                        ...state,
                        items: [
                            ...state.items.slice(0, i * 1),
                            ...state.items.slice((i * 1) + 1)
                        ]
                    }
                }
            }
            return state;
        default:
            return state
    }
};

const selectedCategory = (state = 'active', action) => {
    switch (action.type) {
        case 'SELECT_SUBREDDIT':
            return action.subreddit;
        default:
            return state
    }
};

const emptyMemo = {
    answer: '',
    explain: '',
    id: 0,
    mtime: 0,
    question: '',
    sync_state: '',
    type_id: 0,
};

const memoItem = (state = emptyMemo, action) => {
    switch (action.type) {
        case 'SET_EDIT_MEMO':
            return {...action.item};
        case 'CLEAR_MEMO_ITEM':
            return emptyMemo;
        default:
            return state
    }
};

const memoCategoryList = (state = {isFetching: false, items: []}, action) => {
    switch (action.type) {
        case 'RECEIVE_MEMO_CATEGORY':
            return {...state, items: action.data};
        default:
            return state
    }
};

/******************** Category Reducer **********************/
const categoryList = (state = {isFetching: false, items: []}, action) => {
    switch (action.type) {
        case 'RECEIVE_CATEGORY':
            return {...state, items: action.data};
        case 'UPDATE_CATEGORY':
            return {
                ...state,
                items: state.items.map(
                    item => (item.id === action.values.id) ?
                        {
                            ...item,
                            priority: action.values.priority,
                            color: action.values.color,
                            name: action.values.name
                        }
                        : item
                )
            };
        case 'DELETE_CATEGORY_ITEM':
            for (var i in state.items) {
                if (state.items[i].id === action.id) {
                    return {
                        ...state,
                        items: [
                            ...state.items.slice(0, i * 1),
                            ...state.items.slice((i * 1) + 1)
                        ]
                    }
                }
            }

            return state;
        default:
            return state
    }
};

const emptyCategory = {id: 0, color: '#000000', priority: 1, name: ''};
const categoryItem = (state = emptyCategory, action) => {
    switch (action.type) {
        case 'SET_EDIT_CATEGORY':
            return {...action.item, color: '#' + action.item.color};
        case 'CLEAR_CATEGORY_ITEM':
            return emptyCategory;
        default:
            return state
    }
};

/******************** Todo Reducer **********************/
const todoList = (state = {isFetching: false, items: []}, action) => {
    switch (action.type) {
        case 'RECEIVE_TODO_LIST':
            return {...state, items: action.data};
        default:
            return state
    }
};

const Reducer = combineReducers({memoList, memoItem, memoCategoryList, categoryList, categoryItem, selectedCategory, todoList});
export default Reducer