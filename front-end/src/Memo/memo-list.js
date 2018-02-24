import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Spin} from 'antd';
import {fetchMemoListIfNeeded} from '../Action'
import {CardM} from './card'
import {CardNew} from './card-new'
import {CardMemo} from './card-memo'
import {CardBlog} from './card-blog'
import {CardPhoto} from './card-photo'
import Isotope from 'isotope-layout'

class MemoList_ extends Component {
    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(fetchMemoListIfNeeded(this, {category: '', keyword: ''}));
    }

    componentDidMount() {
        if (this.isotopeInstance === undefined) {
            this.isotopeInstance = new Isotope(this.getList(), {transitionDuration: 0});
        }
    }

    getList() {
        return document.querySelector('#memo-list')
    }

    arrange() {
        this.isotopeInstance = new Isotope(this.getList(), {transitionDuration: 0});
    }

    render() {
        console.log('memo-list render');
        if (this.props.memoList.isFetching) {
            return (
                <div style={{textAlign: 'center', padding: '3em'}}>
                    <Spin size="large"></Spin>
                </div>
            )
        }

        return (
            <div style={{margin: 10}} id="memo-list">
                {this.props.memoList.items.map((item, i) => {
                    if (item.module === null) {
                        return (<CardNew item={item} idx={i} key={'memo-' + i} parent={this}/>)
                    } else if (item.module === 'memo') {
                        return (<CardMemo item={item} idx={i} key={'memo-' + i} parent={this}/>)
                    } else if (item.module === 'blog') {
                        return (<CardBlog item={item} idx={i} key={'memo-' + i} parent={this} history={this.props.history}/>)
                    } else if (item.module === 'photo') {
                        return (<CardPhoto item={item} idx={i} key={'memo-' + i} parent={this}/>)
                    } else {
                        return (<CardM item={item} idx={i} key={'memo-' + i} parent={this}/>)
                    }
                })}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        memoList: state.memoList,
    }
};

export const MemoList = connect(mapStateToProps)(MemoList_);
