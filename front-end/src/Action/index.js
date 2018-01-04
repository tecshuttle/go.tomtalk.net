//memoList
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

//categoryList
export function fetchMemoCategory() {
    return (dispatch, getState) => {
        const state = getState();

        if (state.categoryList.items.length === 0) {
            return fetch('/api/memo/get-type-list')
                .then(response => response.json())
                .then(json => {
                    dispatch({type: 'RECEIVE_CATEGORY', data: json.data})
                }).catch(error => {
                    console.error('LOAD_CATEGORY_LIST', error);
                });
        }
    }
}

