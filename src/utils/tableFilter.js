const tableFilterReducer = (state, action) => {
  return action.type === 'UPDATE_FILTER'
    ? {
        ...state,
        [action.property]: {
          ...(state[action.property] || {}),
          value: action.value,
        },
      }
    : action.payload;
};

export default tableFilterReducer;
