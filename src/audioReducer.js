export default function audioReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_LOADING':
      return {
        ...state,
        isLoaded: true,
      };

    case 'UPDATE_PLAYING':
      return {
        ...state,
        isPlaying: action.payload,
      };

    case 'UPDATE_SLIDERVALUE':
      return {
        ...state,
        sliderValue: action.payload,
      };

    case 'UPDATE_METADATA':
      return {
        ...state,
        isMetaDataLoaded: true,
      };

    case 'UPDATE_DURATION':
      return {
        ...state,
        duration: action.payload,
      };

    case 'UPDATE_MEDIALOADED':
      return {
        ...state,
        isMediaLoaded: true,
      };

    case 'RESET_SOME':
      return {
        ...state,
        sliderValue: 0,
        isPlaying: false,
      };
    default:
      return state;
  }
}
