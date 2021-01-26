import createDataContext from "./createDataContext";

const searchBarReducer = (state, action) => {
  switch (action.type) {
    case "set_query":
      return {
        ...state,
        q: action.payload,
      };
    case "set_search_term":
      return {
        ...state,
        searchTerm: action.payload,
      };
    default:
      return state;
  }
};

const setQuery = (dispatch) => (q) => {
  dispatch({
    type: "set_query",
    payload: q,
  });
};

const setSearchTerm = (dispatch) => (searchTerm) => {
  dispatch({
    type: "set_search_term",
    payload: searchTerm,
  });
};

export const { Context, Provider } = createDataContext(
  searchBarReducer,
  {
    setQuery,
    setSearchTerm,
  },
  { q: "", searchTerm: "" }
);
