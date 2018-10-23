const getters = {
  gameplay: state => state.gameplay,
  roomCode: state => state.gameplay.sync.roomCode,
  pause: state => state.gameplay.pause,
  loader: state => state.gameplay.loader,
  controllerConnected: state => state.gameplay.sync.isControllerConnected,
  desktopConnected: state => state.gameplay.sync.isDesktopConnected,
  role: state => state.gameplay.sync.role,
  mobile: state => state.mobile,
  modalStatus: state => state.modal.status,
  gameState: state => state.gameplay.state,
  fx: state => state.fx,
  track: state => state.track,
  endGame: state => state.gameplay.endGame,
  page: state => state.page,
};

export default getters;
