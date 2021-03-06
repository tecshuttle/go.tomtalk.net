import {notification} from 'antd'
import axios from 'axios'
import Isotope from 'isotope-layout'

const imagesLoaded = require('imagesloaded');

/********************** Memo *********************/
export function fetchMemoListIfNeeded(parent, memoFilter) {
    return (dispatch, getState) => {
        if (shouldFetchPosts(getState(), memoFilter)) {
            dispatch({type: 'SET_MEMO_LIST_FILTER', filter: memoFilter});
            return dispatch(fetchMemoList(memoFilter.category, memoFilter.keyword)).then(() => {
                let nodes = parent.getList();
                if (nodes !== null) {
                    parent.isotopeInstance = new Isotope(nodes, {transitionDuration: 0});

                    imagesLoaded(nodes, function () {
                        parent.isotopeInstance.arrange();
                    });
                }
            });
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
        dispatch({type: 'REQUEST_MEMO'});

        return axios.get('/api/memo/get-list?item_type=' + category + '&keyword=' + keyword, {
            credentials: "same-origin"
        }).then(response => {
            if (response.data.success) {
                if (response.data.data === null) {
                    notification.open({message: '查询结果为空！'});
                } else if (response.data.data.length > 300) {
                    notification.open({message: '列表结果有>300条，请精简查询条件！'});
                } else {
                    dispatch(receiveMemoList(category, response.data));
                }
            } else {
                //未登录
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

export function updateMemoItem(parent, newItem) {
    return (dispatch, getState) => {
        const state = getState();

        //获取旧Item，与新值对比，如果分类有变化：1、更新item分类名称；2、刷新分类列表。
        let oldItem = null;
        state.memoList.items.map((node) => {
            if (node.id === newItem.id) {
                oldItem = node;
            }
            return true;
        });

        if (oldItem.type_id === newItem.type_id) {
            dispatch({type: 'UPDATE_MEMO', values: newItem});
        } else {
            state.memoCategoryList.items.map((node) => {
                if (node.type_id === newItem.type_id) {
                    dispatch({type: 'UPDATE_MEMO', values: {...newItem, type: node.type, color: node.color}});
                }

                return true;
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

        axios({
            url: '/api/memo/save-item',
            method: 'post',
            data: formData
        }).then((response) => {
            if (oldItem.type_id !== newItem.type_id) {
                dispatch(fetchMemoCategoryAPI())
            }

            if (parent !== undefined) {
                parent.isotopeInstance.reloadItems();
                parent.isotopeInstance.arrange();
            }
        }).catch(function (error) {
            console.log(error);
        });
    }
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export function createMemoItem(parent) {
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
                dispatch(fetchMemoList('', '')).then(() => {
                    parent.isotopeInstance.reloadItems();
                    parent.isotopeInstance.arrange();
                });
            } else {
                console.log(responseData);
            }
        }).catch(error => {
            console.error(error);
        });
    }
}

export function deleteMemoItem(parent, id) {
    return (dispatch, getState) => {
        fetch('/api/memo/' + id, {
            method: 'DELETE',
        }).then((response) => response.json()).then((responseData) => {
            if (responseData.success) {
                dispatch({type: 'DELETE_MEMO_ITEM', id: id});
                parent.isotopeInstance.reloadItems();
                parent.isotopeInstance.arrange();
            }
        }).catch(error => {
            console.error(error);
        });
    }
}

export function inBoxMemoItem(id) {
    return (dispatch, getState) => {
        var now = new Date().getTime();
        let formData = new FormData();
        formData.append('id', id);
        formData.append('mtime', parseInt(now / 1000, 10) - (3600 * 24 * 10) + '');

        fetch('/api/memo/save-item', {
            method: 'POST',
            body: formData
        }).then((response) => response.json()).then((responseData) => {
            if (responseData.ret) {
                //nothing
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
        return axios.get('/api/memo/get-type-list')
            .then(response => {
                dispatch({type: 'RECEIVE_MEMO_CATEGORY', data: response.data.data})
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

export function saveJob(iDay, job) {
    return (dispatch, getState) => {
        //更新state
        dispatch({type: 'UPDATE_JOB', iDay: iDay, job: job});

        //todo: 完成则刷新列表，否则只更新列表。

        //更新数据库
        let formData = new FormData();
        formData.append('project_id', job.project_id);
        formData.append('id', job.id);
        formData.append('job_name', job.job_name);
        formData.append('job_type_id', job.job_type_id);
        formData.append('task_type_id', job.task_type_id);
        formData.append('time_long', job.time_long);
        formData.append('job_desc', job.job_desc);
        formData.append('status', job.status);

        //如果start_time===0则是编辑，否则为标记任务完成。
        if (job.start_time !== 0) {
            formData.append('start_time', job.start_time);
        }

        fetch('/api/todo/job', {
            method: 'PUT',
            body: formData,
        }).then((response) => response.json()).then((json) => {
            if (json.success) {
                dispatch(fetchTodoList());
            } else {
                console.log(json);
            }
        }).catch(error => {
            console.error(error);
        });
    }
}

export function moveDay(source, target) {
    return (dispatch, getState) => {
        dispatch({type: 'ADD_JOB', source: source, target: target});
        dispatch({type: 'REMOVE_JOB', iDay: source.iDay, id: source.id});
    }
}

export function moveCard(iDay, sourceIndex, targetIndex) {
    return (dispatch, getState) => {
        dispatch({type: 'MOVE_JOB', iDay: iDay, sourceIndex: sourceIndex, targetIndex: targetIndex});
    }
}

/**
 * job拖动时，会加了isDragging = true 属性，拖动结束后去除这个属性。
 * @param iDay
 * @param id
 */
export function moved(iDay, id) {
    return (dispatch, getState) => {
        // 更新数据库数据
        let formData = new FormData();
        formData.append('id', id);
        formData.append('week_date', '2018-01-08');
        formData.append('to_day', 'day' + (iDay === 6 ? 0 : iDay + 1));
        const jobs = getState().todoList.items[iDay];

        for (var i in jobs) {
            if (jobs[i].id === id) {
                const prev_job = jobs[i - 1];
                const next_job = jobs[i * 1 + 1];
                formData.append('prev_job_id', prev_job === undefined ? 0 : prev_job.id);
                formData.append('next_job_id', next_job === undefined ? 0 : next_job.id);
            }
        }

        fetch('/api/todo/move-job', {
            method: 'POST',
            body: formData
        }).then(handleErrors).then((response) => response.json()).then((responseData) => {
            if (responseData.success) {
                //dispatch(fetchTodoList());
            } else {
                console.log(responseData);
            }
        }).catch(error => {
            console.error(error);
        });

        //更新state
        dispatch({type: 'MOVED_JOB', iDay: iDay, id: id});
    }
}

export function deleteJob(iDay, id) {
    return (dispatch, getState) => {
        fetch('/api/todo/job/' + id, {
            method: 'DELETE',
        }).then((response) => response.json()).then((json) => {
            if (json.success) {
                dispatch({type: 'REMOVE_JOB', iDay: iDay, id: id});
            }
        }).catch(error => {
            console.error(error);
        });
    }
}

/********************** user ********************/
export function checkLogin() {
    return (dispatch, getState) => {
        fetch('/api/user/check-login/', {
            method: 'GET',
            credentials: 'same-origin'
        }).then((response) => response.json()).then((json) => {
            if (json.success) {
                dispatch({
                    type: 'SET_USER', user: {
                        uid: json.uid,
                        name: json.name,
                        email: json.email,
                    }
                });
            }
        }).catch(error => {
            console.error(error);
        });
    }
}

export function setUser(json) {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_USER', user: {
                uid: json.uid,
                name: json.name,
                email: json.email,
            }
        });
    }
}