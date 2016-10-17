
exports.getUserHome = function(req, res){

  if(req.session.userid) {

    res.render('userHome', function (err, data) {
      if (err) {
        console.error(err);
      } else {
        res.end(data);
      }
    });
  }else {
    res.redirect('/');
  }
}
