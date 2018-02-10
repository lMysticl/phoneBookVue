function tokenDecode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

function getTokenExpirationDate(token) {
  const decoded = tokenDecode(token);
  return decoded.exp
}

function isTokenExpired() {
  const token = getToken();
  if(token){
    return Date.now() / 1000 > getTokenExpirationDate(token)
  }
  else {
    return true
  }
}

function getAuthHeader () {
  return 'Bearer ' + getToken()
}

function saveToken(token) {
  localStorage.setItem('access_token', token)
}

function getToken() {
  return localStorage.getItem('access_token')
}

function deleteToken() {
  localStorage.removeItem('access_token')
}

export default {
  getToken,
  saveToken,
  deleteToken,
  getAuthHeader,
  isTokenExpired
}
