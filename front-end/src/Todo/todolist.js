import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Card, Icon} from 'antd'
import {fetchTodoListIfNeed, createTodoJob} from '../Action'

class TodoList_ extends Component {
    componentWillMount() {
        this.props.dispatch(fetchTodoListIfNeed())
    }

    onNew(i_day) {
        i_day = (i_day > 6 ? 0 : i_day);
        this.props.dispatch(createTodoJob(i_day));
    }

    render() {
        return <div style={{margin: 10}}>
            {this.props.todoList.items.map((item, idx) =>
                <Card title={item.name}
                      key={'cat-' + idx} style={styles.card}
                      actions={[<Icon type="plus-circle-o" onClick={() => this.onNew(idx + 1)}/>]}>
                    {item.map((job, idx) => <p key={'job-' + idx} style={job.status === '1' ? {color: "#dddddd"} : {}}>
                        {job.job_name}
                    </p>)}
                </Card>)
            }
        </div>
    }
}

const styles = {
    card: {
        display: 'inline-block',
        marginBottom: 10,
        marginRight: 10,
        width: 250,
    }
};

function mapStateToProps(state, ownProps) {
    return {
        todoList: state.todoList
    }
}

export const TodoList = connect(mapStateToProps)(TodoList_);
