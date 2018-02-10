import React, {Component} from 'react'

export class CardM extends Component {
    componentWillMount() {
        document.title = 'Memo'
    }

    render() {
        return <div style={{...styles.memoCard, padding: '0.6em 1.2em'}} className='memo-card'>
            {this.props.item.module}
        </div>;
    }
}

const styles = {
    memoCard: {
        width: '21em',
        marginRight: '1em',
        marginBottom: '1em',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        padding: 0,
    },
};
