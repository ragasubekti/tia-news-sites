import axios from "axios";
import { GET_NEWS, GET_NEWS_FAIL, GET_NEWS_SUCCESS } from ".";
import { News } from "./news.types.js";

export const getNewsList = (page: number) => async (dispatch: any) => {
  dispatch({
    type: GET_NEWS
  });

  try {
    const newsList = await axios.get(
      "https://www.techinasia.com/wp-json/techinasia/2.0/posts"
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
      types: GET_NEWS_FAIL,
      payload: {
        message: e
      }
    });
  }
};
