import {combineReducers} from 'redux'

const memoList = (state = {
    isFetching: false,
    items: []
}, action) => {
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

const selectedSubreddit = (state = 'active', action) => {
    switch (action.type) {
        case 'SELECT_SUBREDDIT':
            return action.subreddit;
        default:
            return state
    }
};

function posts(
    state = {
        isFetching: false,
        didInvalidate: false,
        items: []
    },
    action
) {
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

const Reducer = combineReducers({memoList, selectedSubreddit, postsBySubreddit});
export default Reducer