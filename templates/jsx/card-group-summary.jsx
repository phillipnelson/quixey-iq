var React = require('react');

module.exports = React.createClass({displayName: 'CardGroupSummaryView',
  remoteSearch: function() {
    var query = this.state.query;
    if(query == undefined || query == null || query == '') {
      return;
    }
    var self = this;
    $.ajax({
      url: RefinementGroupModel.url(query),
      dataType: 'json',
      cache: false,
      success: function(data) {
        self.setState({
          cardGroups: RefinementGroupModel.process(data),
          query: query
        });
      }.bind(this),
      error: function(xhr, status, err) {
        return;
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {
      cardGroups: [], 
      query: this.props.query
    };
  },
  componentDidMount: function() {
    this.remoteSearch();
  },
  isSelected: function(e) {
    if(this.state.cardGroups.length < e.target.attributes["data-card-group-index"].nodeValue) {
      return;
    }
    this.props.selectGroup(this.state.cardGroups[e.target.attributes["data-card-group-index"].nodeValue]);
  },
  render: function() {
    var self = this;
    var cardGroupSummaries = this.state.cardGroups.map(function(cardGroup, index) {
      return (
        <div className="row" key={ cardGroup.id } >
          <div className="col-xs-12 iq-card-group-summary-title">
            <button type="button" data-card-group-index={ index } onClick={ self.isSelected }>{ cardGroup.name }</button>
          </div>
        </div>
      );
    });
    if(this.state.cardGroups.length == 0) {
      return ( <div></div> );
    }
    return (
      <div className="iq-card-group-summary">
        { cardGroupSummaries }
      </div>
    );
  }
});


var RefinementGroupModel = {
  url: function(query) {
    return "/search-"
      + encodeURI(query.toLowerCase().split(" ").join("-"))
      + "-summaries.json";
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
          "summary": dvc["cardContent"]["summary"],
          "id": dvcFurl + dvc["cardContent"]["appName"] + String(i),
          "cards": dvc["cardContent"]["deepViews"].map(function(deepView) {
            return deepView["deepViewContent"]["displayContent"];
          })
        });
      }
    }
    return cardGroups;
  }
};