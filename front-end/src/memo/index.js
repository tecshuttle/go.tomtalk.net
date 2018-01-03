import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    Link
} from 'react-router-dom'

export class Memo extends Component {
    componentWillMount() {
        console.log(this);
    }

    render() {
        return (
            <div>

                <p><Link to="/">Home</Link></p>

                <button>New</button>

                <h2>memo</h2>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        memoList: state.memoList
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onTodoClick: id => {
           
        },
    }
};

Memo = connect(mapStateToProps, mapDispatchToProps)(Memo);

export default Memo
