export function fetchPostsIfNeeded(subreddit) {
    return (dispatch, getState) => {
        if (shouldFetchPosts(getState(), subreddit)) {
            return dispatch(fetchPosts(subreddit))
        }
    }
}

function fetchPosts(category) {
    return dispatch => {

        dispatch(requestPosts(category));

        return fetch('/api/memo/get-list?item_type=' + category + '&uid=1')
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
        data: json.data,
    }
}

function shouldFetchPosts(state, subreddit) {
    const posts = state.postsBySubreddit[subreddit];
    const items = state.memoList.items;
    if (items.length === 0) {
        return true
    } else if (posts.isFetching) {
        return false
    } else {
        return posts.didInvalidate
    }
}

function requestPosts(subreddit) {
    return {
        type: 'REQUEST_POSTS',
        subreddit
    }
}

