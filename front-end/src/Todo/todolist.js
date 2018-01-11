import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Layout, Card} from 'antd'
import {fetchTodoListIfNeed} from '../Action'

const {Content} = Layout;

class TodoList_ extends Component {
    componentWillMount() {
        this.props.dispatch(fetchTodoListIfNeed())
    }

    render() {
        return (
            <Content>
                <div style={{margin: 10}}>
                    {
                        this.props.todoList.items.map((item, idx) => {
                            return (
                                <Card title={item.name} key={'cat-' + idx}
                                      style={{
                                          display: 'inline-block',
                                          marginBottom: 10,
                                          marginRight: 10,
                                          width: 250,
                                          color: '#' + item.color
                                      }}>
                                    {
                                        item.map((job, idx) => {
                                            return (
                                                <p key={'job-' + idx}>
                                                    {job.job_name}
                                                </p>
                                            )
                                        })

                                    }
                                </Card>
                            )
                        })
                    }
                </div>
            </Content>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        todoList: state.todoList
    }
}

export const TodoList = connect(mapStateToProps)(TodoList_);
