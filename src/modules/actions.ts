import axios from "axios";
import {
  GET_NEWS,
  GET_NEWS_FAIL,
  GET_NEWS_SUCCESS,
  GET_NEWS_DETAIL,
  GET_NEWS_DETAIL_SUCCESS,
  GET_NEWS_DETAIL_FAIL
} from ".";
import { News } from "./news.types.js";
import { NewsDetailType } from "./newsDetail.type";

export const getNewsList = (page: number = 0) => async (dispatch: any) => {
  dispatch({
    type: GET_NEWS
  });

  try {
    const newsList = await axios.get(
      "https://tia-request-middleware.herokuapp.com/"
    );

    const newsData: News = newsList.data;

    dispatch({
      type: GET_NEWS_SUCCESS,
      payload: {
        data: newsData.posts,
        currentPage: newsData.current_page
      }
    });
  } catch (e) {
    dispatch({
      type: GET_NEWS_FAIL,
      payload: {
        message: e
      }
    });
  }
};

export const getNewsDetail = (slug: string) => async (dispatch: any) => {
  dispatch({
    type: GET_NEWS_DETAIL
  });

  try {
    const newsList = await axios.get(
      `https://tia-request-middleware.herokuapp.com/${slug}`
    );

    const newsData: NewsDetailType = newsList.data;

    dispatch({
      type: GET_NEWS_DETAIL_SUCCESS,
      payload: {
        data: newsData.posts[0],
        currentPage: newsData.current_page
      }
    });
  } catch (e) {
    dispatch({
      type: GET_NEWS_DETAIL_FAIL,
      payload: {
        message: e
      }
    });
  }
};
