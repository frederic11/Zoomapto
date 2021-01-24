import createDataContext from "./createDataContext";

const bottomSheetReducer = (state, action) => {
  switch (action.type) {
    case "set_bottom_sheet_position":
      return {
        ...state,
        isBottomSheetOpen: action.payload.isBottomSheetOpen,
        snapPosition: action.payload.snapPosition,
      };
    default:
      return state;
  }
};

const toggleBottomSheet = (dispatch) => (isBottomSheetOpen, snapPosition) => {
  dispatch({
    type: "set_bottom_sheet_position",
    payload: { isBottomSheetOpen, snapPosition },
  });
};

export const { Context, Provider } = createDataContext(
  bottomSheetReducer,
  {
    toggleBottomSheet,
  },
  { isBottomSheetOpen: false, snapPosition: 3 }
);
