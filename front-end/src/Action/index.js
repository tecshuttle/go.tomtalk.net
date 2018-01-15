//import Async from 'react-promise'
import {notification} from 'antd'

/********************** Memo *********************/
export function fetchMemoListIfNeeded(memoFilter) {
    return (dispatch, getState) => {
        if (shouldFetchPosts(getState(), memoFilter)) {
            dispatch({type: 'SET_MEMO_LIST_FILTER', filter: memoFilter})
            return dispatch(fetchMemoList(memoFilter.category, memoFilter.keyword))
        }
    }
}

// 通过把memoFilter里面的两个参数：category、keyword，与state原有值进行比较，判断是否要重新加载列表。
function shouldFetchPosts(state, memoFilter) {
    const items = state.memoList.items;

    if (items.length === 0) {
        return true
    } else {
        //处理搜索和分类
        if (memoFilter.category === state.memoListFilter.category && memoFilter.keyword === state.memoListFilter.keyword) {
            return false
        } else {
            return true
        }
    }
}

function fetchMemoList(category, keyword) {
    return dispatch => {
        dispatch({type: 'SET_MEMO_FILTER_CATEGORY', category});
        return fetch('/api/memo/get-list?item_type=' + category + '&keyword=' + keyword + '&uid=1')
            .then(response => response.json())
            .then(json => {
                if (json.data.length > 300) {
                    notification.open({message: '列表结果有>300条，请精简查询条件！'});
                } else {
                    dispatch(receiveMemoList(category, json))
                }
            }).catch(error => {
                console.error('LOAD_LIST', error);
            });
    }
}

export function setMemoItem(id) {
    return (dispatch, getState) => {
        getState().memoList.items.map((item, idx) => {
            if (item.id === id) {
                dispatch({type: 'SET_EDIT_MEMO', item: item});
            }

            return true;
        })
    }
}

export function fetchMemoItem(id) {
    return (dispatch, getState) => {
        if (getState().memoList.items.length === 0) {
            return dispatch(fetchMemoList('', '')).then(
                () => {
                    getState().memoList.items.map((item, idx) => {
                        if (item.id === id) {
                            dispatch({type: 'SET_EDIT_MEMO', item: item})
                        }
                        return true;
                    })
                }
            );
        } else {
            //todo:
        }
    }
}

export function updateMemoItem(newItem) {
    return (dispatch, getState) => {
        const state = getState();

        //获取旧Item，与新值对比，如果分类有变化：1、更新item分类名称；2、刷新分类列表。
        let oldItem = null;
        state.memoList.items.map((node) => {
            if (node.id === newItem.id) {
                oldItem = node;
            }
            return true
        });

        console.log(oldItem, newItem);
        if (oldItem.type_id === newItem.type_id) {
            dispatch({type: 'UPDATE_MEMO', values: newItem});
        } else {
            state.memoCategoryList.items.map((node) => {
                if (node.type_id === newItem.type_id) {
                    dispatch({type: 'UPDATE_MEMO', values: {...newItem, type: node.type, color: node.color}});
                }

                return true
            });
        }

        // 修改数据库
        let formData = new FormData();

        formData.append('id', newItem.id);
        formData.append('type_id', newItem.type_id);
        formData.append('question', newItem.question);
        formData.append('answer', newItem.answer);
        formData.append('module', newItem.module);
        formData.append('sync_state', newItem.sync_state);

        fetch('/api/memo/save-item', {
            method: 'POST',
            body: formData
        }).then((response) => response.json()).then((responseData) => {
            console.log(responseData);
            if (oldItem.type_id !== newItem.type_id) {
                dispatch(fetchMemoCategoryAPI())
            }
        }).catch(error => {
            console.error(error);
        });
    }
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export function createMemoItem() {
    return (dispatch, getState) => {
        let formData = new FormData();
        formData.append('type_id', 0);
        formData.append('question', '');
        formData.append('answer', '');
        formData.append('sync_state', '');

        fetch('/api/memo', {
            method: 'POST',
            body: formData
        }).then(handleErrors).then((response) => response.json()).then((responseData) => {
            if (responseData.ret) {
                dispatch(fetchMemoList('', ''));
            } else {
                console.log(responseData);
            }
        }).catch(error => {
            console.error(error);
        });
    }
}

export function deleteMemoItem(id) {
    return (dispatch, getState) => {
        fetch('/api/memo/' + id, {
            method: 'DELETE',
        }).then((response) => response.json()).then((responseData) => {
            if (responseData.success) {
                dispatch({type: 'DELETE_MEMO_ITEM', id: id});
            }
        }).catch(error => {
            console.error(error);
        });
    }
}

function receiveMemoList(category, json) {
    return {
        type: 'RECEIVE_MEMO',
        data: json.data === null ? [] : json.data,
    }
}

export function fetchMemoCategory() {
    return (dispatch, getState) => {
        const state = getState();

        if (state.memoCategoryList.items.length === 0) {
            dispatch(fetchMemoCategoryAPI())
        }
    }
}

function fetchMemoCategoryAPI() {
    return dispatch => {
        return fetch('/api/memo/get-type-list')
            .then(response => response.json())
            .then(json => {
                dispatch({type: 'RECEIVE_MEMO_CATEGORY', data: json.data})
            }).catch(error => {
                console.error(error);
            });
    }
}

/********************** Category ********************/
export function fetchCategoryList() {
    return (dispatch, getState) => {
        const state = getState();

        if (state.categoryList.items.length === 0) {
            dispatch(fetchCategoryListAPI())
        }
    }
}

function fetchCategoryListAPI() {
    return dispatch => {
        return fetch('/api/category')
            .then(response => response.json())
            .then(json => {
                dispatch({type: 'RECEIVE_CATEGORY', data: json.data})
            }).catch(error => {
                console.error('LOAD_CATEGORY_LIST', error);
            });
    }
}

export function fetchCategoryItem(id) {
    return (dispatch, getState) => {
        if (getState().categoryList.items.length === 0) {
            return dispatch(fetchCategoryListAPI()).then(
                () => {
                    getState().categoryList.items.map((item, idx) => {
                        if (item.id === id) {
                            dispatch({type: 'SET_EDIT_CATEGORY', item: item})
                        }
                        return true;
                    })
                }
            );
        } else {
            //todo:
        }
    }
}

export function setCategoryItem(id) {
    return (dispatch, getState) => {
        getState().categoryList.items.map((item, idx) => {
            if (item.id === id) {
                console.log(item);
                dispatch({type: 'SET_EDIT_CATEGORY', item: item});
            }

            return true;
        })
    }
}

export function updateCategoryItem(values) {
    console.log(values);
    return (dispatch, getState) => {
        // 修改数据库
        let formData = new FormData();

        formData.append('id', values.id);
        formData.append('name', values.name);
        formData.append('priority', values.priority);
        formData.append('color', values.color);

        fetch('/api/category', {
            method: values.id === 0 ? 'POST' : 'PUT',
            body: formData
        }).then((response) => response.json()).then((responseData) => {
            if (values.id === 0) {
                dispatch(fetchCategoryListAPI()) //新增刷新列表
            } else {
                dispatch({type: 'UPDATE_CATEGORY', values: values}); //编辑更新列表
            }
        }).catch(error => {
            console.error(error);
        });
    }
}

export function deleteCategoryItem(id) {
    return (dispatch, getState) => {
        fetch('/api/category/' + id, {
            method: 'DELETE',
        }).then((response) => response.json()).then((responseData) => {
            if (responseData.success) {
                dispatch({type: 'DELETE_CATEGORY_ITEM', id: id});
            }
        }).catch(error => {
            console.error(error);
        });
    }
}

/********************** Todo ********************/
export function fetchTodoListIfNeed() {
    return (dispatch, getState) => {
        const state = getState();
        if (state.todoList.items.length === 0) {
            dispatch(fetchTodoList())
        }
    }
}

function fetchTodoList() {
    return dispatch => {
        return fetch('/api/todo/get-jobs-of-week?day=2018-01-08')
            .then(response => response.json())
            .then(json => {
                dispatch({type: 'RECEIVE_TODO_LIST', data: json.data})
            }).catch(error => {
                console.error(error);
            });
    }
}

export function createTodoJob(i_day) {
    return (dispatch, getState) => {
        let formData = new FormData();
        formData.append('i_day', i_day);
        formData.append('week_day', '2018-01-08');

        fetch('/api/todo/job', {
            method: 'POST',
            body: formData
        }).then(handleErrors).then((response) => response.json()).then((responseData) => {
            if (responseData.success) {
                dispatch(fetchTodoList());
            } else {
                console.log(responseData);
            }
        }).catch(error => {
            console.error(error);
        });
    }
}

