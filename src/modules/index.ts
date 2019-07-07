const GET_NEWS = "@news/GET_NEWS";
const GET_NEWS_DETAIL = "@news/GET_NEWS_DETAIL";

const initialState = {
  list: {
    isLoading: false,
    data: [],
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
    default:
      return state;
  }
};
