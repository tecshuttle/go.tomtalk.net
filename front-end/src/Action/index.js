//import Async from 'react-promise'

/********************** Memo *********************/
export function fetchPostsIfNeeded(subreddit, keyword) {
    return (dispatch, getState) => {
        if (shouldFetchPosts(getState(), subreddit)) {
            return dispatch(fetchPosts(subreddit, keyword))
        }
    }
}

function fetchPosts(category, keyword) {
    return dispatch => {

        dispatch(requestPosts(category));

        return fetch('/api/memo/get-list?item_type=' + category + '&keyword=' + keyword + '&uid=1')
            .then(response => response.json())
            .then(json => {
                dispatch(receivePosts(category, json))
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
            return dispatch(fetchPosts('active', '')).then(
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

export function updateMemoItem(values) {
    return (dispatch, getState) => {
        // 修改state
        dispatch({type: 'UPDATE_MEMO', values: values});

        // 修改数据库
        let formData = new FormData();

        formData.append('id', values.id);
        formData.append('type_id', values.type_id);
        formData.append('question', values.question);
        formData.append('answer', values.answer);
        formData.append('sync_state', values.sync_state);
        //formData.append('mtime', values.mtime);

        fetch('/api/memo/save-item', {
            method: 'POST',
            body: formData
        }).then((response) => response.json()).then((responseData) => {
            console.log(responseData);
        }).catch(error => {
            console.error(error);
        });
    }
}


function receivePosts(category, json) {
    return {
        type: 'RECEIVE_MEMO',
        data: json.data === null ? [] : json.data,
    }
}

function shouldFetchPosts(state, type_item) {
    //const posts = state.postsBySubreddit[subreddit];
    const items = state.memoList.items;

    if (items.length === 0) {
        return true
    } else {
        //todo: 处理搜索和分类
        return true
    }
}

function requestPosts(subreddit) {
    return {
        type: 'REQUEST_POSTS',
        subreddit
    }
}

export function fetchMemoCategory() {
    return (dispatch, getState) => {
        const state = getState();

        if (state.categoryList.items.length === 0) {
            dispatch(fetchMemoCategoryAPI())
        }
    }
}

function fetchMemoCategoryAPI() {
    return dispatch => {
        return fetch('/api/memo/get-type-list')
            .then(response => response.json())
            .then(json => {
                dispatch({type: 'RECEIVE_CATEGORY', data: json.data})
            }).catch(error => {
                console.error('LOAD_CATEGORY_LIST', error);
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
        // 修改state
        dispatch({type: 'UPDATE_CATEGORY', values: values});

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
            console.log(responseData);
        }).catch(error => {
            console.error(error);
        });
    }
}
