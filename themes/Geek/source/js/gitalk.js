var clientID = $("#clientID").val();
var clientSecret = $("#clientSecret").val();
var repo = $("#repo").val();
var owner = $("#owner").val();
var admin = $("#admin").val();

const gitalk = new Gitalk({
  clientID: clientID,
  clientSecret: clientSecret,
  repo: repo,
  owner: owner,
  admin: [admin],
  id: md5(location.pathname),      // Ensure uniqueness and length less than 50
  distractionFreeMode: false  // Facebook-like distraction free mode
})

gitalk.render('gitalk-container')