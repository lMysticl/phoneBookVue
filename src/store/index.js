import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import tokenService from '@/services/token'


Vue.use(Vuex);

const api_url = 'https://vuejs-phone-book-v1.herokuapp.com/';
const login_url = api_url + 'oauth/token';
const registration_url = api_url + "api/register";


function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
}


export default new Vuex.Store({
  state: {
    user: {},
    info: true,
    redirect: null,
    isAuth: false
  },
  getters: {
    user(state) {
      return state.user
    },
    infoShowed(state) {
      return state.info
    },
    isAuth(state) {
      return state.isAuth
    },

    redirect(state) {
      return state.redirect
    },
  },
  mutations: {
    setUser(state, payload) {
      return state.user = Object.assign({}, payload)
    },
    setRedirect(state, payload) {
      state.redirect = payload
    },
    setAuth(state, payload) {
      state.isAuth = payload
    },
    setInfo(state, payload){
      state.info = payload
    }
  },
  actions: {
    login({commit}, {credentials, formData, redirect}) {

      return Vue.http.post(
        login_url,
        formData,
        {headers: {'authorization': "Basic " + b64EncodeUnicode('testjwtclientid:XY7kmzoNzl100')}}
      )
        .then(res => {
          const token = res.body.access_token;
          tokenService.saveToken(token);
          commit('setAuth', true);
          if (redirect) {
            router.push(redirect)
          }
          return true
        })
    },

    registration({commit}, {credentials, data, redirect}) {

      return Vue.http.post(
        registration_url,
        data
      )
        .then(res => {
          if (redirect) {
            router.push(redirect)
          }

          return true
        })
    },
    logOut({commit}) {
      tokenService.deleteToken();
      commit('setAuth', false);
      router.push('/')
    }

  }
})
