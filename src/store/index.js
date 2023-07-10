import { createStore } from "vuex";

const store =  createStore({
  state: {
    // counter: 10
    popState: false
  },
  getters: {
    // time2(state) {
    //   return state.counter * 2;
    // }
    getPopState(state) {
        return state.popState
    }
  },
  mutations: {
    // setCounter(state, value) {
    //   state.counter = value;
    // }
    setPopState(state, value) {
        state.popState = value
    }
  }
});

export default store