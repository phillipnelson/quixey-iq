var React = require('react');
var CardGroupView = require('./card-group.jsx');
var CardGroupSummaryView = require('./card-group-summary.jsx');

module.exports = React.createClass({displayName: 'SearchView',
  remoteSearch: function(query) {
    var self = this;
    $.ajax({
      url: QuixeyModel.url(query),
      dataType: 'json',
      cache: false,
      success: function(data) {
        self.setState({
          cardGroups: QuixeyModel.process(data),
          query: query
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(query, status, err.toString());
      }.bind(this)
    });
  },
  instantSearch: function(cardGroups) {
    return cardGroups.filter(function(cardGroup) {
      if(!self.state.query || self.state.query.length == 0) return true;
      var text = "";
      for(var i=0;i<cardGroup.cards.length;i++) {
        var card = cardGroup.cards[i];
        for(var key in card) {
          text = text + cardGroup[key] + " ";
        }  
      }
      return text.toLowerCase().indexOf(self.state.query.toLowerCase()) != -1;
    });
  },
  getInitialState: function() {
    // todo keep track of this.
    // this.allCardGroups = [];
    return {
      cardGroups: [], 
      query: false
    };
  },
  search: function(e) {
    var query = e.detail.query;
    console.log("Search: " + query);
    if(query.length > 0) {
      this.remoteSearch(query);
    }
    // #todo: add better logic with instant search and delays
    // this.setState({query: e.detail.query});
  },
  queryChange: function(e) {
    var query = e.detail.query;
    if(query.length <= 0) {
      this.setState(this.getInitialState())
    }
  },
  componentDidMount: function() {
    $global.search.addEventListener("search", this.search);
    $global.search.addEventListener("search-query-change", this.queryChange);
  },
  selectGroup: function(cardGroup) {
    console.log("Query refined: ", cardGroup.name);
    var newCardGroups = [cardGroup];
    newCardGroups = newCardGroups.concat(this.state.cardGroups);
    this.setState({
      query: this.state.query + " " + cardGroup.name,
      cardGroups: newCardGroups
    });
  },
  render: function() {
    var self = this;
    if(this.state.cardGroups.length == 0 && this.state.query == 0) {
      return (
        <div className="container">
          <div className="big-logo"><h1 className="animated bounce infinite">iQ</h1></div>
        </div>
      );
    }
    var cardGroupViews = this.state.cardGroups.map(function(cardGroup) {
      return (
        <CardGroupView 
          cardGroup={ cardGroup } 
          selectGroup={ self.selectGroup }
          key={ cardGroup.id } />
      );
    });
    return (
      <div className="container">
        <CardGroupSummaryView
          query={ this.state.query }
          selectGroup={ self.selectGroup } 
          key={ "summary" + this.state.query } />
        { cardGroupViews }
      </div>
    );
  }
});

var QuixeyModel = {
  url: function(query) {
    return "/search-"
      + encodeURI(query.toLowerCase().split(" ").join("-"))
      + ".json";
  },
  process: function(body) {
    var dvcFurls = Object.keys(body["deepViewCards"]);
    
    var cardGroups = [];

    for(var i=0; i<dvcFurls.length; i++) {

      var dvcFurl = dvcFurls[i];
      var dvc = body["deepViewCards"][dvcFurl];

      if("cardContent" in dvc 
          && "deepViews" in dvc["cardContent"]
          && dvc["cardContent"]["deepViews"] instanceof Array
          && dvc["cardContent"]["appName"] != 'YellowPages') {
        cardGroups.push({
          "name": dvc["cardContent"]["appName"],
          "id": dvcFurl + dvc["cardContent"]["appName"] + String(i),
          "summary": null,
          "cards": dvc["cardContent"]["deepViews"].map(function(deepView) {
            return deepView["deepViewContent"]["displayContent"];
          })
        });
      }
    }
    return cardGroups;
  }
};
