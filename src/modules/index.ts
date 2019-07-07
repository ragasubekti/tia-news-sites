export const GET_NEWS = "@news/GET_NEWS";
export const GET_NEWS_SUCCESS = "@news/GET_NEWS_SUCCESS";
export const GET_NEWS_FAIL = "@news/GET_NEWS_FAIL";

export const GET_NEWS_DETAIL = "@news/GET_NEWS_DETAIL";
export const GET_NEWS_DETAIL_SUCCESS = "@news/GET_NEWS_DETAIL_SUCCESS";
export const GET_NEWS_DETAIL_FAIL = "@news/GET_NEWS_DETAIL_FAIL";

const initialState = {
  list: {
    isLoading: false,
    data: [],
    currentPage: 0,
    hasError: false,
    errorMessage: ""
  },
  detail: {
    isLoading: false,
    data: {},
    hasError: false,
    errorMessage: ""
  }
};

interface ReduxAction {
  type: string;
  payload?: any;
}

export default (state = initialState, action: ReduxAction) => {
  switch (action.type) {
    case GET_NEWS:
      return {
        ...state,
        list: {
          ...state.list,
          isLoading: true
        }
      };
    case GET_NEWS_SUCCESS:
      return {
        ...state,
        list: {
          ...state.list,
          isLoading: false,
          data: state.list.data.concat(action.payload.data),
          currentPage: action.payload.currentPage
        }
      };
    case GET_NEWS_DETAIL:
      return {
        ...state,
        detail: {
          ...state.detail,
          isLoading: true
        }
      };
    case GET_NEWS_DETAIL_SUCCESS:
      return {
        ...state,
        detail: {
          ...state.detail,
          isLoading: false,
          data: action.payload.data
        }
      };

    default:
      return state;
  }
};
