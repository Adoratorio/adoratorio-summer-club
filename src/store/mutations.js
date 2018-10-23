import Vue from 'vue';

const mutations = {
  SET_DEVICE_ROLE: (state, payload) => {
    const localState = state;
    localState.gameplay.sync.role = payload;
  },
  SET_DESKTOP_UID: (state, payload) => {
    const localState = state;
    localState.gameplay.sync.desktopUID = payload.currentUID;
  },
  SET_CONTROLLER_UID: (state, payload) => {
    const localState = state;
    localState.gameplay.sync.controllerUID = payload.currentUID;
  },
  SET_SERVER_STATE: (state, payload) => {
    const localState = state;
    localState.gameplay.sync.isServerConnected = payload;
  },
  SET_DESKTOP_STATE: (state, payload) => {
    const localState = state;
    localState.gameplay.sync.isDesktopConnected = payload;
  },
  SET_CONTROLLER_STATE: (state, payload) => {
    const localState = state;
    localState.gameplay.sync.isControllerConnected = payload;
  },
  TOGGLE_PAUSE: (state) => {
    const localState = state;
    localState.gameplay.pause = !localState.gameplay.pause;
  },
  TOGGLE_LOADER: (state) => {
    const localState = state;
    localState.gameplay.loader = !localState.gameplay.loader;
  },
  SET_ROOM_CODE: (state, payload) => {
    const localState = state;
    localState.gameplay.sync.roomCode = payload.code;
  },
  SET_GAME_STATE: (state, payload) => {
    const localState = state;
    Vue.set(localState.gameplay, 'state', payload);
  },

  SET_MODE: (state, payload) => {
    const localState = state;
    localState.gameplay.mode = payload;
  },

  SET_PAGE: (state, payload) => {
    const localState = state;
    localState.page = payload;
  },

  SET_PLAY_HOME_ANIMATION: (state, payload) => {
    const localState = state;
    localState.playHomeAnimation = payload;
  },

  IS_MOBILE(state, payload) {
    const localState = state;
    localState.isMobile = payload;
  },

  IS_MOBILE_DEVICE(state, payload) {
    const localState = state;
    localState.isMobileDevice = payload;
  },

  SET_MODAL: (state, payload) => {
    const localState = state;
    localState.modal = payload;
  },

  SET_END_GAME: (state, payload) => {
    const localState = state;
    localState.gameplay.endGame = payload;
  },

  SET_VALID: (state, payload) => {
    const localState = state;
    localState.gameplay.state.isValid[payload.position] = payload.state;
  },
};

export default mutations;
