import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Layout, Select, Button, Input, Icon, notification, Card} from 'antd';
import {fetchMemoListIfNeeded, fetchMemoCategory, createMemoItem, deleteMemoItem} from '../Action'
import Isotope from 'isotope-layout'

const ReactMarkdown = require('react-markdown');
const {Content} = Layout;
const Option = Select.Option;
const Search = Input.Search;

class MemoList_ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
        };
    }

    componentWillMount() {
        const {dispatch, selectedCategory} = this.props;
        dispatch(fetchMemoListIfNeeded(selectedCategory, ''));
        dispatch(fetchMemoCategory())
    }

    componentDidUpdate() {
        new Isotope(document.querySelector('#memo-list'))
    }

    onClick(category) {
        this.props.dispatch(fetchMemoListIfNeeded(category, ''));
    }

    onActiveClick() {
        this.props.dispatch(fetchMemoListIfNeeded('active', ''));
    }

    onSearch(keyword) {
        if (keyword === '') {
            notification.open({
                message: '空值不能搜索！'
            });
        } else {
            this.props.dispatch(fetchMemoListIfNeeded('search', keyword));
        }
    }

    emitEmpty = () => {
        this.keywordInput.focus();
        this.setState({keyword: ''});
    };

    onChangeUserName = (e) => {
        this.setState({keyword: e.target.value});
    };

    onEdit(id) {
        this.props.history.push(this.props.match.url + '/edit/' + id);
    }

    onDelete(id) {
        this.props.dispatch(deleteMemoItem(id));
    }

    onNew() {
        this.props.dispatch(createMemoItem());
    }

    render() {
        const {keyword} = this.state;
        const me = this;
        const suffix = keyword ? <Icon type="close-circle" onClick={this.emitEmpty}/> : null;

        return (
            <Content>
                <div style={{margin: 10}}>
                    <Button onClick={this.onNew.bind(this)} type='primary' style={{marginRight: 10}}>新建</Button>
                    <Button onClick={this.onActiveClick.bind(this)}>活动条目</Button>

                    <Select style={{width: 200, marginLeft: 10, marginRight: 10}} placeholder='请选择分类'
                            onChange={this.onClick.bind(this)}>
                        {
                            this.props.memoCategoryList.items.map((item, idx) => (
                                <Option value={item.type} key={'cat-' + idx}>
                                    {item.type + ' ' + (item.count === null ? 0 : item.count)}
                                </Option>
                            ))
                        }
                    </Select>

                    <Search
                        style={{width: 200}} placeholder="请输入搜索关键字"
                        onSearch={this.onSearch.bind(this)} enterButton value={keyword}
                        suffix={suffix} onChange={this.onChangeUserName}
                        ref={node => this.keywordInput = node}
                    />
                </div>

                <div style={{margin: 10}} id="memo-list">
                    {this.props.memoList.items.map((item, idx) => {
                        const delBtn = (
                            item.question === '' && item.answer === '' ?
                                <Icon type="delete" onClick={() => me.onDelete(item.id)} style={{marginRight: 10}}/>
                                : ''
                        );
                        const editBtn = <Icon type="edit" onClick={() => me.onEdit(item.id)}/>;
                        return (
                            <Card title={[
                                <Icon type='tag' key={'tag-' + idx} style={{color: (item.color === null ? '' : '#' + item.color)}}/>,
                                <span style={{color: (item.color === null ? '' : '#' + item.color)}}
                                      key={'span-' + idx}>{item.type + ' ' + item.question}</span>]}
                                  extra={<div>{delBtn}{editBtn}</div>}
                                  style={{
                                      width: 300,
                                      color: (item.color === null ? '' : '#' + item.color),
                                      display: 'inline-block',
                                      marginRight: 10,
                                      marginBottom: 10
                                  }}
                                  key={'memo-' + idx}>
                                <ReactMarkdown style={{color: '#' + item.color}} source={item.answer}/>
                            </Card>
                        )
                    })}
                </div>
            </Content>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        memoList: state.memoList,
        memoCategoryList: state.memoCategoryList,
        selectedCategory: state.selectedCategory
    }
};

export const MemoList = connect(mapStateToProps)(MemoList_);
