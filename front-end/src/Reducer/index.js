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

/******************** Category Reducer **********************/
const categoryList = (state = {isFetching: false, items: []}, action) => {
    switch (action.type) {
        case 'RECEIVE_CATEGORY':
            return {...state, items: action.data};
        case 'UPDATE_CATEGORY':
            return {
                ...state,
                items: state.items.map(
                    item => (item.type_id === action.values.type_id) ?
                        {
                            ...item,
                            priority: action.values.priority,
                            color: action.values.color,
                            type: action.values.type
                        }
                        : item
                )
            };
        default:
            return state
    }
};

const emptyCategory = {color: '#000000', priority: 0, type_id: 0, type: '', count: ''};
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

const selectedSubreddit = (state = 'active', action) => {
    switch (action.type) {
        case 'SELECT_SUBREDDIT':
            return action.subreddit;
        default:
            return state
    }
};

function posts(state = {isFetching: false, didInvalidate: false, items: []}, action) {
    switch (action.type) {
        case 'INVALIDATE_SUBREDDIT':
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case 'REQUEST_POSTS':
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case 'RECEIVE_POSTS':
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items: action.posts,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

function postsBySubreddit(state = {}, action) {
    switch (action.type) {
        case 'INVALIDATE_SUBREDDIT':
        case 'RECEIVE_POSTS':
        case 'REQUEST_POSTS':
            return Object.assign({}, state, {
                [action.subreddit]: posts(state[action.subreddit], action)
            });
        default:
            return state
    }
}

const Reducer = combineReducers({memoList, memoItem, categoryList, categoryItem, selectedSubreddit, postsBySubreddit});
export default Reducer