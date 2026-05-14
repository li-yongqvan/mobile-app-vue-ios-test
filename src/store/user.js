import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('jwt_token') || '',
    userInfo: JSON.parse(localStorage.getItem('user_info')) || null,
  }),
  actions: {
    login(token, user) {
      this.token = token;
      this.userInfo = user;
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('user_info', JSON.stringify(user));
    },
    logout() {
      this.token = '';
      this.userInfo = null;
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_info');
    },
    updateUserInfo(user) {
      this.userInfo = user;
      localStorage.setItem('user_info', JSON.stringify(user));
    }
  }
});
