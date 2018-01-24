import React, {Component} from 'react';
import {Card, Icon} from 'antd'
import {createTodoJob, moveDay, moveCard, moved, deleteJob, saveJob} from '../Action'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Job from './Job'
import {connect} from "react-redux";

class CardDay_ extends Component {
    constructor(props) {
        super(props);
        this.moveCard = this.moveCard.bind(this);
        this.moveDay = this.moveDay.bind(this);
        this.moved = this.moved.bind(this);
        this.deleteJob = this.deleteJob.bind(this);
        this.saveJob = this.saveJob.bind(this);
        this.state = {
            cards: props.jobs
        }
    }

    componentWillMount() {

    }

    onNew(iDay) {
        iDay = (iDay > 6 ? 0 : iDay);
        this.props.dispatch(createTodoJob(iDay));
    }

    moveDay(dragItem, hoverItem) {
        this.props.dispatch(moveDay(dragItem, hoverItem))
    }

    moveCard(iDay, dragIndex, hoverIndex) {
        this.props.dispatch(moveCard(iDay, dragIndex, hoverIndex));
    }

    moved(iDay, id) {
        this.props.dispatch(moved(iDay, id));
    }

    deleteJob(iDay, id) {
        this.props.dispatch(deleteJob(iDay, id));
    }

    saveJob(iDay, job) {
        this.props.dispatch(saveJob(iDay, job));
    }

    render() {
        const {iDay, cards} = this.props;
        const lastCellStyle = (iDay === 6 ? {marginRight: 0} : {});

        return <Card style={{...styles.card, ...lastCellStyle}}
                     bodyStyle={{padding: 10}}
                     actions={[<Icon type="plus-circle-o" onClick={() => this.onNew(iDay + 1)}/>]}>
            {
                cards.map((job, i) =>
                    <Job
                        job={job}
                        iDay={iDay}
                        key={job.id}
                        index={i}
                        id={job.id}
                        text={job.job_name}
                        moveDay={this.moveDay}
                        moveCard={this.moveCard}
                        moved={this.moved}
                        deleteJob={this.deleteJob}
                        saveJob={this.saveJob}
                    />
                )
            }
        </Card>
    }
}

const styles = {
    card: {
        flex: 1,
        marginRight: 10,
        alignSelf: 'flex-start'
    }
};

function mapStateToProps(state, ownProps) {
    return {
        todoLists: state.todoList, //不引入列表，job修改后，不会触发render。
        cards: state.todoList.items[ownProps.iDay]
    }
}

export const CardDay = connect(mapStateToProps)(CardDay_);
export default DragDropContext(HTML5Backend)(CardDay)