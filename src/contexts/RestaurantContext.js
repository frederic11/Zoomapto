import createDataContext from "./createDataContext";

const restaurantReducer = (state, action) => {
  switch (action.type) {
    case "select_restaurant":
      return { ...state, selectedRestaurant: action.payload };
    case "set_bottom_sheet_ref":
      return { ...state, sheetRef: action.payload };
    default:
      return state;
  }
};

const selectRestaurant = (dispatch) => (restaurant) => {
  dispatch({ type: "select_restaurant", payload: restaurant });
};

const setBottomSheetRef = (dispatch) => (sheetRef) => {
  dispatch({ type: "set_bottom_sheet_ref", payload: sheetRef });
};

export const { Context, Provider } = createDataContext(
  restaurantReducer,
  { selectRestaurant, setBottomSheetRef },
  null
);
