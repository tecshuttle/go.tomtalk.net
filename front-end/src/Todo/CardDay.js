import React, {Component} from 'react';
import update from 'immutability-helper'
import {Card, Icon} from 'antd'
import {createTodoJob} from '../Action'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Job from './Job'
import {connect} from "react-redux";

class CardDay_ extends Component {
    constructor(props) {
        super(props)
        this.moveCard = this.moveCard.bind(this)
        this.state = {
            cards: props.jobs
        }
    }

    componentWillMount() {

    }

    onNew(i_day) {
        i_day = (i_day > 6 ? 0 : i_day);
        this.props.dispatch(createTodoJob(i_day));
    }

    moveCard(dragIndex, hoverIndex) {
        const {cards} = this.state
        const dragCard = cards[dragIndex]

        this.setState(
            update(this.state, {
                cards: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
                },
            }),
        )
    }

    render() {
        const {cards} = this.state;
        const {idx} = this.props;
        return <Card style={styles.card}
                     actions={[<Icon type="plus-circle-o" onClick={() => this.onNew(idx + 1)}/>]}>
            {
                cards.map((job, i) =>
                    <Job
                        idx={i}
                        job={job}
                        day={i}
                        key={job.id}
                        index={i}
                        id={job.id}
                        text={job.job_name}
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

export const CardDay = connect()(CardDay_);
export default DragDropContext(HTML5Backend)(CardDay)