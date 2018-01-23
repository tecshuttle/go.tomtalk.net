import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {findDOMNode} from 'react-dom'
import {DragSource, DropTarget} from 'react-dnd'
import ItemTypes from './Sortable/ItemTypes'
import {Modal, Button} from 'antd';

var flow = require('lodash/flow');

// 当前拖动对象所带的参数
const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            iDay: props.iDay,
            index: props.index,
        }
    },
};

// component为悬浮对象
const cardTarget = {
    hover(props, monitor, component) {
        const dragItem = monitor.getItem();
        const dragIndex = dragItem.index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return
        }

        // Time to actually perform the action
        // 获取前后iDay，判断有无跨天。dragItem为当前拖动对象，props为当前悬浮对象。
        if (dragItem.iDay === props.iDay) {
            props.moveCard(dragItem.iDay, dragIndex, hoverIndex);
            dragItem.index = hoverIndex;
        } else {
            props.moveDay(dragItem, {id: props.id, iDay: props.iDay, index: props.index});
            dragItem.iDay = props.iDay;
            dragItem.index = props.index;
        }
    },

    drop(props, monitor, component) {
        if (monitor.didDrop()) {
            return;
        }

        props.moved(props.iDay, props.id);
        return {moved: true};
    }
};

export class Job extends Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        index: PropTypes.number.isRequired,
        isDragging: PropTypes.bool.isRequired,
        id: PropTypes.any.isRequired,
        text: PropTypes.string.isRequired,
        moveDay: PropTypes.func.isRequired,
        moveCard: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            checkbox: '',
            visible: false,
        };
        this.onClick = this.onClick.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentWillMount() {
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.setState({
            visible: false,
        });
    }

    onClick(e) {
        this.showModal();
    }

    delete() {
        this.setState({
            visible: false,
        });
        this.props.deleteJob(this.props.iDay, this.props.job.id);
    }

    render() {
        const me = this;
        const {isDragging, connectDragSource, connectDropTarget} = this.props;
        const {id, job} = this.props;
        const opacity = (isDragging || job.isDragging ? 0.3 : 1);

        let delBtn = null;
        if (job.job_name === '') {
            delBtn = <div>
                <span onClick={() => this.delete()}>删除</span>
                <span onClick={this.edit}>编辑</span>
            </div>
        }

        return connectDragSource(
            connectDropTarget(<div>
                    <div key={id}
                         id={id}
                         onClick={this.onClick}
                         style={{opacity, margin: 0, color: job.status === '1' ? '#dddddd' : ''}}>
                        {job.job_name}
                        {delBtn}
                    </div>

                    <Modal
                        title="Basic Modal"
                        visible={this.state.visible}
                        onOk={me.handleOk}
                        onCancel={me.handleCancel}
                        footer={[
                            <Button key="delete" onClick={this.delete}>删除</Button>,
                            <Button key="back" onClick={this.handleCancel}>Return</Button>,
                            <Button key="submit" type="primary" onClick={this.handleOk}>Submit</Button>,
                        ]}
                    >
                        <p>{job.id}</p>
                        <p>{job.job_name}</p>
                    </Modal>
                </div>
            )
        )
    }
}

export default flow(
    DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    })),
    DropTarget(ItemTypes.CARD, cardTarget, (connect) => ({
        connectDropTarget: connect.dropTarget(),
    }))
)(Job)