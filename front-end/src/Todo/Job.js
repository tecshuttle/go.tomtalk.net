import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {findDOMNode} from 'react-dom'
import {DragSource, DropTarget} from 'react-dnd'
import ItemTypes from './Sortable/ItemTypes'
import {Modal, Button, Form, Input, Slider, DatePicker} from 'antd';
import moment from 'moment';

function formatter(value) {
    return `${value} 小时`;
}

const FormItem = Form.Item;
const {TextArea} = Input;
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

class Job_ extends Component {
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
        this.doneJob = this.doneJob.bind(this);
    }

    componentWillMount() {
    }

    setFieldsValue() {
        this.props.form.setFieldsValue({
            name: this.props.job.job_name,
            desc: this.props.job.job_desc,
        });
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = (e) => {
        e.preventDefault();
        this.setState({visible: false});
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let job = {...this.props.job};
                job.start_time = values.start_time.unix();
                job.job_name = values.job_name;
                job.job_desc = values.job_desc;
                job.time_long = values.time_long * 3600;
                this.props.saveJob(this.props.iDay, job);
            } else {
                console.log(err);
            }
        });
    };

    handleCancel = (e) => {
        e.preventDefault();
        this.setState({
            visible: false,
        });
    };

    onClick(e) {
        this.showModal();
    }

    delete() {
        this.setState({
            visible: false,
        });
        this.props.deleteJob(this.props.iDay, this.props.job.id);
    }

    doneJob() {
        this.setState({
            visible: false,
        });

        let job = {...this.props.job};
        job.status = "1";
        job.start_time = 0;
        this.props.saveJob(this.props.iDay, job);
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

        const {getFieldDecorator} = this.props.form;

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
                            <Button key="cancel" onClick={this.handleCancel}>取消</Button>,
                            <Button key="done" onClick={this.doneJob}>完成</Button>,
                            <Button key="save" onClick={this.handleOk} type="primary">保存</Button>,
                        ]}
                    >
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem>
                                {getFieldDecorator('start_time', {
                                    initialValue: moment(this.props.job.start_time * 1000)
                                })(
                                    <DatePicker/>
                                )}
                            </FormItem>

                            <FormItem>
                                {getFieldDecorator('job_name', {
                                    initialValue: this.props.job.job_name
                                })(
                                    <Input placeholder="工作名称"/>
                                )}
                            </FormItem>

                            <FormItem>
                                {getFieldDecorator('time_long', {
                                    initialValue: this.props.job.time_long / 3600
                                })(
                                    <Slider tipFormatter={formatter} min={0} max={5} step={0.1}/>
                                )}
                            </FormItem>

                            <FormItem>
                                {getFieldDecorator('job_desc', {
                                    initialValue: this.props.job.job_desc
                                })(
                                    <TextArea placeholder="工作内容"
                                              autosize={{minRows: 2, maxRows: 8}}/>
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                </div>
            )
        )
    }
}

export const Job = Form.create()(Job_);

export default flow(
    DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    })),
    DropTarget(ItemTypes.CARD, cardTarget, (connect) => ({
        connectDropTarget: connect.dropTarget(),
    }))
)(Job)

