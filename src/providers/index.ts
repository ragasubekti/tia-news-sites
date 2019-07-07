import axios from "axios";

export const getNewsList = () =>
  axios.get("https://www.techinasia.com/wp-json/techinasia/2.0/posts");
