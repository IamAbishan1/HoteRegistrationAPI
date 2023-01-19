const helpers = {
    formattedImagePath: function (req, path) {
      return "http://" + req.headers.host + "/" + path.toString().replace(/\\/g, "/");
    },
    pick:
      (...props) =>
      (o) =>
        props.reduce((a, e) => ({ ...a, [e]: o[e] }), {}),
    doesnotContainRestrictedChars: function (input) {
     
      let doesNotContain = true;
      let spaceAtFirst = true;
      let spaceAtLast = true;
      let doubleSpace = true;
      if(input.charAt(0)==" ") spaceAtFirst=false;
      if(input.charAt(input.length-1)==" ") spaceAtFirst=false;
      
      for (let i = 0; i < input.length-1; i++) {
          if (input.charAt(i)==" " && input.charAt(i+1)==" "){
            doubleSpace = false;
            break;
          }
        }
  
      const regax = new RegExp('^[a-zA-Z0-9{ }]*$');
      doesNotContain = regax.test(input);
      
      if(spaceAtFirst && doesNotContain && spaceAtLast && doubleSpace) return true;
      else return false;
    },
  };
  
  module.exports = helpers;