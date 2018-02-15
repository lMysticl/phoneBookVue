// const api_url = 'http://localhost:8080/';
// const login_url = api_url + 'oauth/token';
// const registration_url = api_url + "/registration";
//
// import tokenService from '@/services/token'
// import router from '@/router'
//
// function b64EncodeUnicode(str) {
//   return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
//     function toSolidBytes(match, p1) {
//       return String.fromCharCode('0x' + p1);
//     }));
// }
//
//
// export default {
//
//   user: {
//     authenticated: false
//   },
//
//   login(context, credentials, formData, redirect) {
//     return context.$http.post(
//       login_url,
//       formData,
//       {headers: {'authorization': "Basic " + b64EncodeUnicode(credentials.username + ':' + credentials.password)}}
//     )
//       .then(res => {
//         const token = res.body.access_token;
//         tokenService.saveToken(token);
//         this.user.authenticated = true;
//         if (redirect) {
//           router.push(redirect)
//         }
//         return true
//
//       })
//
//   },
//   registration(context, credentials, formData, redirect) {
//     return context.$http.post(
//       login_url,
//       formData,
//       {headers: {'authorization': "Basic " + b64EncodeUnicode(credentials.username + ':' + credentials.password)}}
//     )
//       .then(res => {
//         const token = res.body.access_token;
//         tokenService.saveToken(token);
//         this.user.authenticated = true;
//         if (redirect) {
//           router.push(redirect)
//         }
//         return true
//
//       })
//
// },
//
//   isAuth(){
//     return this.user.authenticated
//   }
//
//
// }
