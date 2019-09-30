const shortener = (url) => {
  const baseURL = "u.rl/"
  return `${baseURL}${makeid(6)}`
}


function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// console.log(shortener("google.com"));
module.exports = shortener;


// u.rl/buJUE9
