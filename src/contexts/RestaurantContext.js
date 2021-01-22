import createDataContext from "./createDataContext";

const restaurantReducer = (state, action) => {
  switch (action.type) {
    case "select_restaurant":
      return { ...state, selectedRestaurant: action.payload };
    default:
      return state;
  }
};

const selectRestaurant = (dispatch) => (restaurant) => {
  dispatch({ type: "select_restaurant", payload: restaurant });
};

export const { Context, Provider } = createDataContext(
  restaurantReducer,
  { selectRestaurant },
  null
);
