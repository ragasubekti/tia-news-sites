import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getNewsDetail } from "../modules/actions";

class NewsDetail extends React.Component<any, any> {
  componentDidMount() {
    const slug = this.props.match.params.slug;

    this.props.getNewsDetail(slug);
  }
  render() {
    return <div>This is news detail</div>;
  }
}

const mapStateToProps = (state: any) => ({
  detail: state.detail
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      getNewsDetail
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsDetail);
