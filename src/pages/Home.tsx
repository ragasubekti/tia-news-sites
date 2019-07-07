import React from "react";
import { connect } from "react-redux";
import { getNewsList } from "../modules/actions";
import { ThunkDispatch } from "redux-thunk";
import { bindActionCreators } from "redux";
import { Post } from "../modules/news.types";

class Home extends React.Component<any, any> {
  async componentDidMount() {
    this.props.getNewsList();
  }

  render() {
    return (
      <ul>
        {this.props.newsList.data.map((item: Post, index: number) => (
          <li key={index}>{item.title}</li>
        ))}
      </ul>
    );
  }
}

const mapStateToProps = (state: any) => ({
  newsList: state.list
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      getNewsList
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
