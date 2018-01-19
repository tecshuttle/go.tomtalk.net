import React, {Component} from 'react';
import update from 'immutability-helper'
import {Card, Icon} from 'antd'
import {createTodoJob, moveDay, moveCard} from '../Action'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Job from './Job'
import {connect} from "react-redux";

class CardDay_ extends Component {
    constructor(props) {
        super(props);
        this.moveCard = this.moveCard.bind(this);
        this.moveDay = this.moveDay.bind(this);
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
        const {cards} = this.state;
        this.props.dispatch(moveDay(dragItem, hoverItem))
        //const dragCard = cards[dragIndex]
        /*this.setState(
            update(this.state, {
                cards: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
                },
            }),
        )*/
    }

    moveCard(iDay, dragIndex, hoverIndex) {
        const {cards} = this.state;
        const dragCard = cards[dragIndex];
        this.props.dispatch(moveCard(iDay, dragIndex, hoverIndex));

        /*this.setState(
            update(this.state, {
                cards: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
                },
            }),
        )*/
    }

    render() {
        const {cards} = this.props;
        const {iDay} = this.props;
        return <Card style={styles.card} actions={[<Icon type="plus-circle-o" onClick={() => this.onNew(iDay + 1)}/>]}>
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
                    />
                )
            }
        </Card>
    }
}

const styles = {
    card: {
        display: 'inline-block',
        marginBottom: 10,
        marginRight: 10,
        width: 255,
    }
};

function mapStateToProps(state, ownProps) {
    return {
        cards: state.todoList.items[ownProps.iDay]
    }
}

export const CardDay = connect(mapStateToProps)(CardDay_);
export default DragDropContext(HTML5Backend)(CardDay)