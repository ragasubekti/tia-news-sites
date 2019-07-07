import React from "react";
import { connect } from "react-redux";

class NewsDetail extends React.Component {
  componentDidMount() {}
  render() {
    return <div>This is news detail</div>;
  }
}

export default connect()(NewsDetail);
