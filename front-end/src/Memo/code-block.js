const React = require('react')
const PropTypes = require('prop-types');
const hljs = window.hljs;

console.log(window.hljs);
console.log(hljs);

class CodeBlock extends React.PureComponent {
    constructor(props) {
        super(props)
        this.setRef = this.setRef.bind(this)
    }

    setRef(el) {
        this.codeEl = el
    }

    componentDidMount() {
        this.highlightCode()
    }

    componentDidUpdate() {
        this.highlightCode()
    }

    highlightCode() {
        console.log('highlightCode', window.hljs);
        window.hljs.highlightBlock(this.codeEl)
    }

    render() {
        return (
            <pre>
        <code ref={this.setRef} className={this.props.language}>
          {this.props.value}
        </code>
      </pre>
        )
    }
}

CodeBlock.defaultProps = {
    language: ''
}

CodeBlock.propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.string
}

module.exports = CodeBlock