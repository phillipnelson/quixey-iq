var React = require('react');

module.exports = React.createClass({displayName: 'ActionView',
  getInitialState: function() {
    return this.props.card;
  },
  render: function() {
  	if(this.state['@id'].indexOf('eat24') != -1) {
	    return (
	      <a className="btn iq-card-action" href={ this.state.url } role="button">Order Food</a>
	    );
	}
	return (
      <div></div>
    );
  }
});

