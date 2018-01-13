import React, {Component} from 'react';
import update from 'immutability-helper'
import {Card, Icon} from 'antd'
import {createTodoJob} from '../Action'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {Job} from './Job'

class CardDay extends Component {
    constructor(props) {
        super(props)
        this.moveCard = this.moveCard.bind(this)
        this.state = {
            cards: [
                {id: 1, text: 'Write a cool JS library'},
                {id: 2, text: 'Make it generic enough'},
                {id: 3, text: 'Write README'},
                {id: 4, text: 'Create some examples'},
                {id: 5, text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)'},
                {id: 6, text: '???'},
                {id: 7, text: 'PROFIT'},
            ],
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
        const {idx, jobs} = this.props;
        return <Card style={styles.card}
                     actions={[<Icon type="plus-circle-o" onClick={() => this.onNew(idx + 1)}/>]}>
            {
                jobs.map((job, idx) =>
                    <Job
                        job={job}
                        day={idx}
                        key={idx}
                        index={idx}
                        id={idx}
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

export default DragDropContext(HTML5Backend)(CardDay)