import { createStore } from "vuex";

const store =  createStore({
  state: {
    popState: false,
    loadingState: false,
    loginYnState: false,
    userId: "",
    accessToken: ""
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
    },
    getUserId(state) {
      return state.userId
    },
    getAccessToken(state) {
      return state.accessToken
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
    },
    setUserId(state, value) {
      state.userId = value
    },
    setAccessToken(state, value) {
      state.accessToken = value
    }
  }
});

export default store