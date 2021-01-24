import createDataContext from "./createDataContext";

const restaurantReducer = (state, action) => {
  switch (action.type) {
    case "select_restaurant":
      return { ...state, selectedRestaurant: action.payload };
    case "set_restaurant_recent_review":
      return {
        ...state,
        RestaurantsRecentReviews: {
          [action.payload.restaurantId]: {
            isLoading: false,
            reviews: action.payload.reviews,
          },
        },
      };
    case "set_restaurant_recent_review_loading":
      return {
        ...state,
        RestaurantsRecentReviews: {
          [action.payload]: {
            isLoading: true,
          },
        },
      };
    default:
      return state;
  }
};

const selectRestaurant = (dispatch) => (restaurant) => {
  dispatch({ type: "select_restaurant", payload: restaurant });
};

const setRestuarantRecentReview = (dispatch) => (reviews, restaurantId) => {
  dispatch({
    type: "set_restaurant_recent_review",
    payload: { reviews, restaurantId },
  });
};

const setRestuarantRecentReviewLoadingState = (dispatch) => (restaurantId) => {
  dispatch({
    type: "set_restaurant_recent_review_loading",
    payload: restaurantId,
  });
};

export const { Context, Provider } = createDataContext(
  restaurantReducer,
  {
    selectRestaurant,
    setRestuarantRecentReview,
    setRestuarantRecentReviewLoadingState,
  },
  null
);
