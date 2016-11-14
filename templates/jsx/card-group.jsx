var React = require('react');
var CardView = require('./card.jsx');

module.exports = React.createClass({displayName: 'CardGroupView',
  getInitialState: function() {
    return this.props.cardGroup;
  },
  componentDidMount: function() {
    // pass
  },
  isSelected: function() {
    // this.props.selectGroup(this.state);
  },
  selectCard: function(card) {
    // #todo 
  },
  render: function() {
    var self = this;
    var cardViews = this.state.cards.map(function(card) {
      return (
        <CardView 
          card={ card } 
          selectCard={ self.selectCard }
          key={ card.url + card['@id'] + card['crawled'] } />
      );
    });
    if(this.state.summary) {
      var cardGroupSummary = (
        <div className="row">
          <div className="col-xs-12 iq-card-group-summary">
            <p>{ this.state.summary }</p>
          </div>
        </div>
      );
    } else {
      var cardGroupSummary = ( <div></div> );      
    }
    return (
      <div className="iq-card-group" key={this.state.id }>
        <div className="row">
          <div className="col-xs-12 iq-card-group-title">
            <button type="button" onClick={ this.isSelected }>{ this.state.name }</button>
          </div>
        </div>
        { cardGroupSummary }
        <div className="row">
          <div className="col-xs-12 iq-card-group-cards">
            <ul className="media-list">
              { cardViews }
            </ul>
          </div>
        </div>
      </div>
    );
  }
});