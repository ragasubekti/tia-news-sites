import React from "react";
import { connect } from "react-redux";
import { getNewsList } from "../modules/actions";
import { ThunkDispatch } from "redux-thunk";
import { bindActionCreators } from "redux";
import { Post } from "../modules/news.types";

import styled from "@emotion/styled";

const PostListStyled = styled.ul`
  margin: 2rem auto;
  li {
    list-style: none;
    display: flex;
    cursor: pointer;
    &:hover {
      background: rgba(0, 0, 0, 0.01);
    }
  }

  title {
  }
`;

const PostContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

export const PostTitle = styled.div`
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
`;

const PostThumbnail = styled.img`
  width: 400px;
  margin: 0 1.4rem 1rem 0;
`;

const PostAuthor = styled.div`
  display: flex;
  margin-top: 1rem;
  align-items: center;
`;

const PostAvatar = styled.img`
  border-radius: 50%;
  margin-right: 10px;
`;

const PostShortText = styled.div``;

class Home extends React.Component<any, any> {
  async componentDidMount() {
    this.props.getNewsList();
  }

  render() {
    return (
      <PostListStyled>
        {this.props.newsList.isLoading && (
          <div>Please Wait.. The Content is Loading</div>
        )}

        {this.props.newsList.data.map((item: Post, index: number) => (
          <li
            key={index}
            onClick={() => {
              this.props.history.push(`/${item.slug}`);
            }}
          >
            <PostThumbnail
              src={item.featured_image.source}
              width="400px"
              alt={item.seo.title}
            />
            <PostContentWrapper>
              <PostTitle
                dangerouslySetInnerHTML={{
                  __html: item.title
                }}
              />
              <PostShortText>
                {item.excerpt.replace(/(<([^>]+)>)/gi, "")}
              </PostShortText>

              <PostAuthor>
                <PostAvatar
                  src={item.author.avatar_url}
                  width="30px"
                  alt={item.author.display_name}
                />

                {item.author.display_name}
              </PostAuthor>
            </PostContentWrapper>
          </li>
        ))}
      </PostListStyled>
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
