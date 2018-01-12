import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Layout, Select, Button, Input, Icon, notification} from 'antd';
import {fetchMemoListIfNeeded, fetchMemoCategory, createMemoItem} from '../Action'
import {CardM} from './card'
import Isotope from 'isotope-layout'

const imagesLoaded = require('imagesloaded');
const {Content} = Layout;
const Option = Select.Option;
const Search = Input.Search;

class MemoList_ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
        };

        this.onEdit = this.onEdit.bind(this);
    }

    componentWillMount() {
        const {dispatch, selectedCategory} = this.props;
        dispatch(fetchMemoListIfNeeded(selectedCategory, ''));
        dispatch(fetchMemoCategory())
    }

    componentDidUpdate() {
        const $grid = new Isotope(document.querySelector('#memo-list'));
        imagesLoaded(document.querySelector('#memo-list'), function () {
            $grid.arrange();
        });
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

    onNew() {
        this.props.dispatch(createMemoItem());
    }

    onEdit(id) {
        this.props.history.push(this.props.match.url + '/edit/' + id);
    }

    render() {
        const {keyword} = this.state;
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
                    {this.props.memoList.items.map((item, i) => {
                        if (item.module === null) {
                            return (<CardM type="empty" item={item} idx={i} key={'memo-' + i}/>)
                        } else {
                            return (<CardM type={item.module} item={item} idx={i} key={'memo-' + i} onEdit={this.onEdit}/>)
                        }
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
