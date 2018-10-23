const state = {
  // Tutte le proprietà legate allo stato del gameplay
  gameplay: {
    // Può essere: null se non è ancora stata fatta nessuna scelta
    //             'desktop' se è in modalita solo desktop
    //             'mobile' se è in modalita solo mobile
    //             'synced' se è in modalita sincronizzata con mobile
    mode: null,
    // Descrive lo stato della connessione in modalita sincronizzata
    sync: {
      // Il ruolo della pagina corrente
      // Può essere 'desktop' se è la su cui sto giocando
      //            'controller' se è il telefono che controlla il desktop
      role: null,
      // Da watchare per vedere se qualcosa si disconnette
      isServerConnected: false,
      isDesktopConnected: false,
      isControllerConnected: false,
      // Sarà una stringa quando la room è creata
      roomCode: null,
      // Gli ID univoci per controller e desktop, vengono assegnati
      // quando si fà una richiesta di connessione prima di aprire il socket
      desktopUID: null,
      controllerUID: null,
    },
    // Lo stato attuale del gameplay, ancora da fare
    state: {
      counter: 0,
      correct: 0,
      error: 0,
      uncorrect: 0,
      level: 0,
      combo: 0,
      fold: 0,
      uncorrectCombo: 0,
      isValid: {
        left: 'uncorrect',
        center: 'uncorrect',
        right: 'uncorrect',
      },
    },
    // Abbastanza esplicativo... ma volevo mettere un commento perchè sta bene
    pause: true,
    loader: true,
    endGame: false,
  },

  page: 'loader',

  isMobile: null,
  isMobileDevice: null,

  modal: {
    status: false,
    message: '',
  },

  // Indicate whether or not play the home animation
  playHomeAnimation: true,

  fx: new Map(),
  track: null,
  loop: null,
};

export default state;
