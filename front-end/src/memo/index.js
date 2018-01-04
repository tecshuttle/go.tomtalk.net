import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchPostsIfNeeded} from '../Action'

class Memo extends Component {
    componentWillMount() {
        const {dispatch, selectedSubreddit} = this.props;
        dispatch(fetchPostsIfNeeded(selectedSubreddit))
    }

    onClick() {
    }

    render() {
        return (
            <div>

                <p><Link to="/">Home</Link></p>
                <button onClick={() => this.onClick()}>New</button>

                <h2>memo</h2>
                <hr/>
                {this.props.memoList.items.map((item, idx) => (
                    <div key={'item' + idx}>
                        <h1>{item.question}</h1>
                        <p>{item.answer}</p>
                    </div>
                ))}
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        memoList: state.memoList,
        selectedSubreddit: state.selectedSubreddit
    }
};

export default connect(mapStateToProps)(Memo);
