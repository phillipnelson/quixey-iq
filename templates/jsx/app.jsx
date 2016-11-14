/**
 * Created by phillip on 3/22/16.
 */

var ReactDOM = require('react-dom');
var React = require('react');

var SearchView = require('./search.jsx');
var SearchInputView = require('./search-input.jsx');

ReactDOM.render(
  <SearchInputView />,
  document.getElementById('app-menu')
);

ReactDOM.render(
  <SearchView />,
  document.getElementById('main-content')
);
