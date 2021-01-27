import createDataContext from "./createDataContext";

const restaurantReducer = (state, action) => {
  switch (action.type) {
    case "set_is_loading":
      return { ...state, isLoading: true };
    case "select_restaurant":
      return { ...state, selectedRestaurant: action.payload };
    case "set_restaurant":
      return { ...state, restaurants: action.payload, isLoading: false };
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

const setRestaurants = (dispatch) => (restaurants) => {
  dispatch({ type: "set_restaurant", payload: restaurants });
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

const setIsRestaurantLoading = (dispatch) => () => {
  dispatch({
    type: "set_is_loading",
  });
};

export const { Context, Provider } = createDataContext(
  restaurantReducer,
  {
    selectRestaurant,
    setRestuarantRecentReview,
    setRestuarantRecentReviewLoadingState,
    setRestaurants,
    setIsRestaurantLoading,
  },
  null
);
