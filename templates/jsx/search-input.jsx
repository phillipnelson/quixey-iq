var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({displayName: 'SearchInputView',
  getInitialState: function() {
    this.query = null;
    return { searching: false };
  },
  componentDidMount: function() {
    $global.search = ReactDOM.findDOMNode(this);
    var $inputElement = $('.event-search input');
    var self = this;
    $inputElement.focus();
    $inputElement.keypress(function(e) {
      if(e.which == 13) {
        self.query = e.target.value;
        self.explicitSearch();
      }
    });
  },
  search: function(e) {
    this.query = e.target.value;
    $global.search.dispatchEvent(new CustomEvent("search-query-change", { detail: { query: this.query } }));
  },
  explicitSearch: function() {
    $global.search.dispatchEvent(new CustomEvent("search", { detail: { query: this.query } }));
  },
  render: function() {
    return (
      <li className="event-search">
        <input type="text" className="form-control" placeholder="Search" onChange={ this.search } />
      </li>
    );
  }
});


