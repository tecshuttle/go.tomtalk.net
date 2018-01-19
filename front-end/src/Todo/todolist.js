import React, {Component} from 'react';
import CardDay from './CardDay'
import {connect} from 'react-redux'
import {fetchTodoListIfNeed} from '../Action'

class TodoList_ extends Component {
    componentWillMount() {
        this.props.dispatch(fetchTodoListIfNeed())
    }

    render() {
        return <div style={{margin: 10}}>
            {
                this.props.todoList.items.map((item, i) =>
                    <CardDay jobs={item} iDay={i} key={'day-' + i}/>
                )
            }
        </div>
    }
}

function mapStateToProps(state, ownProps) {
    return {
        todoList: state.todoList
    }
}

export const TodoList = connect(mapStateToProps)(TodoList_);




