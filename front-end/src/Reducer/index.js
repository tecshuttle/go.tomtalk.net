import {combineReducers} from 'redux'

/******************** Memo Reducer ***********************/
const memoList = (state = {isFetching: false, items: []}, action) => {
    switch (action.type) {
        case 'REQUEST_MEMO':
            return {items: [], isFetching: true};
        case 'RECEIVE_MEMO':
            return {items: action.data, isFetching: false};
        case 'ADD_MEMO':
            return {...state, items: [...state.items, state.items.length + 1]};
        case 'UPDATE_MEMO':
            /*for (var i in state.items) {
                if (state.items[i].id === action.values.id) {
                    state.items[i] = {
                        ...state.items[i],
                        question: action.values.question,
                        answer: action.values.answer,
                        type_id: action.values.type_id,
                        type: action.values.type,
                        color: action.values.color,
                    };
                    break;
                }
            }

            return state;*/
            return {
                ...state,
                items: state.items.map(
                    item => (item.id === action.values.id) ?
                        {
                            ...item,
                            question: action.values.question,
                            answer: action.values.answer,
                            type_id: action.values.type_id,
                            type: action.values.type,
                            color: action.values.color,
                        }
                        : item
                )
            };
        case 'DELETE_MEMO_ITEM':
            /*for (i in state.items) {
                if (state.items[i].id === action.id) {
                    return {
                        ...state,
                        items: [
                            ...state.items.slice(0, i * 1),
                            ...state.items.slice((i * 1) + 1)
                        ]
                    }
                }
            }*/
            return state;
        default:
            return state
    }
};

const memoListFilter = (state = {category: '', keyword: ''}, action) => {
    switch (action.type) {
        case 'SET_MEMO_FILTER_CATEGORY':
            return {...state, category: action.category};
        case 'SET_MEMO_FILTER_KEYWORD':
            return {...state, keyword: action.keyword};
        case 'SET_MEMO_LIST_FILTER':
            return action.filter;
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
        case 'REMOVE_JOB':
            let iDayJobs = state.items[action.iDay];
            for (var i in iDayJobs) {
                if (iDayJobs[i].id === action.id) {
                    state.items[action.iDay] = [
                        ...iDayJobs.slice(0, i * 1),
                        ...iDayJobs.slice((i * 1) + 1)
                    ];
                }
            }

            return {...state};
        case 'ADD_JOB':
            // 取源job
            const sourceJobs = state.items[action.source.iDay];
            let sourceJob = null;
            for (i in sourceJobs) {
                if (sourceJobs[i].id === action.source.id) {
                    sourceJob = sourceJobs[i];
                }
            }

            // 插入job
            let targetJobs = state.items[action.target.iDay];

            for (var j in targetJobs) {
                if (j * 1 === action.target.index) {
                    state.items[action.target.iDay] = [
                        ...targetJobs.slice(0, j * 1),
                        {...sourceJob, isDragging: true},
                        ...targetJobs.slice((j * 1))
                    ];
                }
            }

            return {...state};
        case 'MOVE_JOB':
            // 取源sourceJob
            const sourceJob_ = state.items[action.iDay][action.sourceIndex];

            //删除sourceJob
            let sourceJobs_ = state.items[action.iDay];
            let newJobs = [
                ...sourceJobs_.slice(0, action.sourceIndex * 1),
                ...sourceJobs_.slice((action.sourceIndex * 1) + 1)
            ];

            //插入到targetIndex
            let jobs = [
                ...newJobs.slice(0, action.targetIndex * 1),
                sourceJob_,
                ...newJobs.slice((action.targetIndex * 1))
            ];

            state.items[action.iDay] = jobs;
            return {...state};
        case 'MOVED_JOB':
            // 取源job
            iDayJobs = state.items[action.iDay];
            let items = state.items;
            for (j in iDayJobs) {
                if (iDayJobs[j].id === action.id) {
                    iDayJobs[j].isDragging = false;
                    break
                }
            }
            items[action.iDay] = iDayJobs;
            state.items[action.iDay] = [...iDayJobs];
            return {...state};
        case 'UPDATE_JOB':
            // 取源job
            iDayJobs = state.items[action.iDay];
            for (j in iDayJobs) {
                if (iDayJobs[j].id === action.job.id) {
                    iDayJobs[j] = {...action.job};
                    break
                }
            }
            state.items[action.iDay] = iDayJobs;
            return {...state};
        default:
            return state
    }
};

const emptyUser = {uid: 0, email: '', name: ''};
const user = (state = emptyUser, action) => {
    switch (action.type) {
        case 'SET_USER':
            console.log(action);
            return {...action.user};
        case 'CLEAR_USER':
            return emptyUser;
        default:
            return state
    }
};

const Reducer = combineReducers({memoListFilter, memoCategoryList, memoList, memoItem, categoryList, categoryItem, todoList, user});
export default Reducer