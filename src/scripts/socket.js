import io from 'socket.io-client';
import store from '@/store/index';

const socket = {
  url: 'https://adoratorio-summerclub.herokuapp.com',
  // Contiene l'oggetto creato da socket.io
  reference: null,
  // Usato per controllare il ruolo da committare allo store
  isDesktop: null,
  // Utilizzata per richiedere una room, se è il codice è presente
  // viene ritornata l'intera room
  async room(code = false) {
    let room = null;
    try {
      if (!code) {
        const response = await fetch(`${socket.url}/createroom`);
        room = await response.json();
      } else {
        const response = await fetch(`${socket.url}/getroom/${code}`);
        room = await response.json();
      }
      // Commit del codice della stanza appena ottenuto
      store.commit('SET_ROOM_CODE', { code: room.code });
      // store.commit('SET_GAME_STATE', { state: room.status });
    } catch (error) {
      throw error;
    }
    return room;
  },
  // Utilizzato per connettere il client sia desktop che mobile.
  // per prima cosa chiede l'uid del dispositivo e poi lo usa per
  // aprire il socket, una volta aperto il socket si mette in ascolto di tutti glie eventi
  async connect(isDesktop = true) {
    socket.isDesktop = isDesktop;
    const code = store.state.gameplay.sync.roomCode;
    let currentUID = null;
    try {
      const response = await fetch(`${socket.url}/${isDesktop ? 'createdesktop' : 'createmobile'}/${code}`);
      const room = await response.json();
      if (typeof room.uid === 'undefined') throw new Error(room.message);
      if (isDesktop) {
        currentUID = room.clients.desktop.uid;
      } else {
        currentUID = room.clients.mobile.uid;
      }
    } catch (error) {
      throw error;
    }
    // Committa l'uid nello store
    store.commit(isDesktop ? 'SET_DESKTOP_UID' : 'SET_CONTROLLER_UID', { currentUID });
    // Connette il socket
    socket.reference = io(`${socket.url}/${code}`, {
      reconnection: false,
      query: {
        uid: currentUID,
      },
      forceNew: true,
    });
    // Link all the events to the socket
    socket.addListeners(socket.reference);
    return socket.reference;
  },
  // Aggiunge tutti i listener al socket
  addListeners: (socketInstance) => {
    socketInstance.on('connect', socket.handlers.connect);
    socketInstance.on('disconnect', socket.handlers.disconnect);
    socketInstance.on('desktopconnected', socket.handlers.desktopConnected);
    socketInstance.on('mobileconnected', socket.handlers.mobileConnected);
    socketInstance.on('desktopdisconnected', socket.handlers.desktopDisconnected);
    socketInstance.on('mobiledisconnected', socket.handlers.mobileDisconnected);
    socketInstance.on('leftclick', socket.handlers.leftClick);
    socketInstance.on('rightclick', socket.handlers.rightClick);
    socketInstance.on('pause', socket.handlers.pause);
    socketInstance.on('restart', socket.handlers.restart);
    socketInstance.on('endgame', socket.handlers.end);
    socketInstance.on('quit', socket.handlers.quit);
    socketInstance.on('gameover', socket.handlers.gameover);
  },
  handlers: {
    connect: () => {
      console.log('Socket connected 😎');
      store.commit('SET_DEVICE_ROLE', socket.isDesktop ? 'desktop' : 'controller');
      store.commit('SET_SERVER_STATE', true);
    },
    disconnect: () => {
      console.log('Server connection lost 🤯');
      store.commit('SET_SERVER_STATE', false);
    },
    desktopConnected: () => {
      console.log('Desktop connected 🖥');
      store.commit('SET_DESKTOP_STATE', true);
    },
    mobileConnected: () => {
      console.log('Controller connected 🕹');
      store.commit('SET_CONTROLLER_STATE', true);
    },
    desktopDisconnected: () => {
      console.log('Desktop disconnected 🖥 🤬');
      store.commit('SET_DESKTOP_STATE', false);
    },
    mobileDisconnected: () => {
      console.log('Controller disconnected 🕹 🤬');
      store.commit('SET_CONTROLLER_STATE', false);
    },
    leftClick: () => {
      console.log('Left click 👈🏼');
      window.dispatchEvent(new CustomEvent('leftclick'));
    },
    rightClick: () => {
      console.log('Right click 👉🏼');
      window.dispatchEvent(new CustomEvent('rightclick'));
    },
    pause: () => {
      console.log('Pause toggled ✋🏼');
      store.commit('TOGGLE_PAUSE');
    },
    restart: () => {
      console.log('Restarting 👾');
      window.dispatchEvent(new CustomEvent('restart'));
    },
    end: (data) => {
      console.log('End! ⛔️');
      window.dispatchEvent(new CustomEvent('endgame', {
        detail: {
          score: data.result,
        },
      }));
    },
    quit: () => {
      console.log('Quit game 🏁');
      window.dispatchEvent(new CustomEvent('quitgame'));
    },
    gameover: () => {
      console.log('Game over 🚨');
      window.dispatchEvent(new CustomEvent('gameover'));
    },
  },
  sendClick(side) {
    socket.reference.emit(`${side}click`);
  },
  pauseGame() {
    socket.reference.emit('pause');
  },
  restartGame() {
    socket.reference.emit('restart');
  },
  sendScore() {
    socket.reference.emit('sendscore', {
      state: store.state.gameplay.state,
      timestamp: Date.now(),
    });
  },
  endGame(score) {
    socket.reference.emit('endgame', {
      result: score,
    });
  },
  quitGame() {
    socket.reference.emit('quit');
    store.commit('SET_DESKTOP_STATE', false);
    store.commit('SET_CONTROLLER_STATE', false);
    store.commit('SET_DEVICE_ROLE', null);

    if (!store.state.pause) store.commit('TOGGLE_PAUSE');
    if (!store.state.loader) store.commit('TOGGLE_LOADER');

    socket.reference.disconnect();
  },
  gameOver() {
    socket.reference.emit('gameover');
  },
};

export default socket;
