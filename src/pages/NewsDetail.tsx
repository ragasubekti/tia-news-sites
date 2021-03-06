import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getNewsDetail } from "../modules/actions";
import { Helmet } from "react-helmet";

import { PostTitle, PostAuthor, PostAvatar } from "./Home";
import { Post } from "../modules/newsDetail.type";
import styled from "@emotion/styled";

const PostDetail = styled.div`
  font-family: "Merriweather", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  img {
    width: 300px;
    height: 100%;
  }

  h3 {
    margin-top: 1rem;
  }

  .wp-caption-text {
    color: #333;
    font-style: italic;
    font-size: smaller;
  }
`;

class NewsDetail extends React.Component<any, any> {
  componentDidMount() {
    const slug = this.props.match.params.slug;

    this.props.getNewsDetail(slug);
  }
  render() {
    const isLoading = this.props.detail.isLoading;
    const data: Post = this.props.detail.data;

    return (
      <React.Fragment>
        <Helmet>
          <title>{`nanoTIA - ${!isLoading &&
            data.seo &&
            data.seo.title}`}</title>

          {!isLoading && data.seo && (
            <meta name="description" content={data.seo.description} />
          )}
        </Helmet>
        <div className="container">
          {isLoading && <div>Please Wait.. The Content is Loading</div>}

          {!isLoading && (
            <PostTitle
              style={{
                margin: "1rem 0",
                fontSize: "28pt"
              }}
              dangerouslySetInnerHTML={{
                __html: data.title
              }}
            />
          )}

          {!isLoading && data.author && (
            <PostAuthor
              style={{
                marginBottom: "2rem"
              }}
            >
              <PostAvatar src={data.author.avatar_url} width="50px" />
              {data.author.display_name}
            </PostAuthor>
          )}

          {!isLoading && data.excerpt && (
            <PostDetail
              dangerouslySetInnerHTML={{
                __html: data.excerpt
              }}
            />
          )}

          {!isLoading && data.featured_image && (
            <img
              src={data.featured_image.source}
              alt={data.featured_image.caption}
              style={{ height: "380px", marginBottom: "2rem" }}
            />
          )}
        </div>

        {!isLoading && data.content && (
          <PostDetail
            dangerouslySetInnerHTML={{
              __html: data.content
            }}
          />
        )}
      </React.Fragment>
    );
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
