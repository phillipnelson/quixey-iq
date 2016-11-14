var React = require('react');
var ActionView = require('./action.jsx');

module.exports = React.createClass({displayName: 'CardView',
  getInitialState: function() {
    return this.props.card;
  },
  navigate: function() {
    window.open(this.state.url);
  },
  render: function() {
    var bodyText = "";
    if("address" in this.state) {
      bodyText = this.state.address;
    }
    return (
      <li className="media iq-card">
          <div className="media-body">
            <h4 className="media-heading" onClick={ this.navigate }>{ this.state.name }</h4>
            <p>{ bodyText }</p>
            <ActionView 
              card={ this.state } />
          </div>
          <div className="media-right">
            <img src={ this.state.image } />
          </div>
      </li>
    );
  }
});