import { createStore } from "vuex";

const store =  createStore({
  state: {
    popState: false,
    loadingState: false,
    loginYnState: false
  },
  getters: {
    getPopState(state) {
        return state.popState
    },
    getLoadingState(state) {
      return state.loadingState
    },
    getLoginYnState(state) {
      return state.loginYnState
    }
  },
  mutations: {
    setPopState(state, value) {
        state.popState = value
    },
    setLoadingState(state, value) {
        state.loadingState = value
    },
    setLoginYnState(state, value) {
        state.loginYnState = value
    }
  }
});

export default store