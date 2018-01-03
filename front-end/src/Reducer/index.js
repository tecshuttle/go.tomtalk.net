import {combineReducers} from 'redux'

const memoList = (state = [1, 2, 3, 4], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [...state, {
                id: action.id,
                text: action.text,
                completed: false,
                editing: false
            }];
        case 'TOGGLE_TODO':
            return state.map(
                todo => (todo.id === action.id) ?
                    {...todo, completed: !todo.completed}
                    : todo
            );
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

const Reducer = combineReducers({memoList});
export default Reducer