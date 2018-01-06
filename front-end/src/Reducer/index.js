import {combineReducers} from 'redux'

const memoList = (state = {isFetching: false, items: []}, action) => {
    switch (action.type) {
        case 'REQUEST_MEMO':
            return {...state, isFetching: true};
        case 'RECEIVE_MEMO':
            return {...state, items: action.data};
        case 'ADD_MEMO':
            return {...state, items: [...state.items, state.items.length + 1]};
        case 'DELETE_TODO':
            return [
                ...state.slice(0, action.idx),
                ...state.slice(action.idx + 1)
            ];
        case 'TOGGLE_EDIT':
            return state.map(
                todo => (todo.id === action.todo.id) ?
                    {...todo, editing: !todo.editing}
                    : todo
            );
        case 'TEXT_CHANGE':
            return state.map(
                todo => (todo.id === action.todo.id) ?
                    {...todo, text: action.text}
                    : todo
            );
        default:
            return state
    }
};

const categoryList = (state = {isFetching: false, items: []}, action) => {
    switch (action.type) {
        case 'REQUEST_MEMO':
            return {...state, isFetching: true};
        case 'RECEIVE_CATEGORY':
            return {...state, items: action.data};
        case 'ADD_MEMO':
            return {...state, items: [...state.items, state.items.length + 1]};
        case 'DELETE_TODO':
            return [
                ...state.slice(0, action.idx),
                ...state.slice(action.idx + 1)
            ];
        case 'TOGGLE_EDIT':
            return state.map(
                todo => (todo.id === action.todo.id) ?
                    {...todo, editing: !todo.editing}
                    : todo
            );
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

const emptyState = {color: '#000000', priority: 0, type_id: 0, type: '', count: ''};
const categoryItem = (state = emptyState, action) => {
    switch (action.type) {
        case 'SET_EDIT_CATEGORY':
            return {...action.item, color: '#' + action.item.color};
        case 'CLEAR_CATEGORY_ITEM':
            return emptyState;
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

const Reducer = combineReducers({memoList, categoryList, categoryItem, selectedSubreddit, postsBySubreddit});
export default Reducer