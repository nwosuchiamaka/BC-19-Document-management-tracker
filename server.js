const express = require('express');
const bodyParser = require('body-parser');
const rootPath = __dirname + '/public/';
const firebase = require('firebase');
const firebaseDb = require('firebase/database');
const session  = require('express-session');

const app = express();
app.set('trust proxy', 1);

app.use(session({
    secret: 'asdf',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var config = {
    apiKey: "AIzaSyBdMB3Jhq99sbscoRllbcnhk-zy18dOq-E",
    authDomain: "document-management-bc0f7.firebaseapp.com",
    databaseURL: "https://document-management-bc0f7.firebaseio.com",
    storageBucket: "document-management-bc0f7.appspot.com",
    messagingSenderId: "580680167444"
};

firebase.initializeApp(config);

const userModel = require('./models/User')(firebase);
const docModel = require('./models/Document')(firebase);

app.set('view engine', 'ejs');
app.use('/public', express.static(rootPath));



app.get('/document-success', function(req, res){
    res.render('pages/document-success', {user: req.session.userData});
});

app.get('/dashboard', function(req, res){
    if(typeof req.session.userData == 'undefined'){
        res.redirect('/');
    }else{
        console.log(req.session);
        res.render('pages/dashboard', {user: req.session.userData});
    }
});

app.route('/add-document')
    .get(function(req, res){
        if(typeof req.session.userData == 'undefined'){
            res.redirect('/');
        }
        res.render('pages/add-document', {user: req.session.userData, errors: [], message: ''});
    })
    .post(function(req, res) {
        const title = req.body.title;
        const link = req.body.link;
        const keyword = req.body.keyword;
        const department = req.body.department;

        docModel.createDoc(req.session.userData.fullname, title, link, keyword, department, function(result){
            if(result.status == 'success'){
                res.redirect('/document-success');
            }else{
                res.render('pages/add-document', {user: req.session.userData,
                    errors: result.data, message: result.message});
            }
        });


    });


app.route('/signup')
    .get(function(req, res){
        if(typeof req.session.isLoggedIn !== 'undefined' && req.session.isLoggedIn){
            res.redirect('/dashboard');
        }
        res.render('pages/signup', {errors: [''], message: ''});
    })
    .post(function(req, res){

        const fullName = req.body.fullname;
        const userName = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const retypePassword = req.body.confirmpassword;

        userModel.signUp(fullName, userName, email, password, retypePassword, function(result){
            console.log(result);
            if(result.status == 'success'){
                res.redirect('/');
            }else{
                res.render('pages/signup', {errors: result.data, message: result.message});
            }

        });
    });

app.get('/view-document', function(req, res){
    if(typeof req.session.userData == 'undefined'){
        res.redirect('/');
    }

    if(req.query.id){
        docModel.getDocument(req.query.id, function(result) {
            console.log(result);
            res.render('pages/view-doc', {
                user: req.session.userData,
                document: result
            });
        });
    }else{
        res.redirect('/dashboard');
    }
});

app.get('/search', function(req, res){
    if(typeof req.session.userData == 'undefined'){
        res.redirect('/');
    }

    if (req.query.department) {
        docModel.getDocumentByDepartment(req.query.department, function(result) {
            console.log(result);
            res.render('pages/search', {
                user: req.session.userData,
                searchValue: req.query.department,
                documents: result
            });
        });
    } else if(req.query.filter) {
        docModel.filterModel(req.query.filter, req.query.search, function(result) {
           console.log('Result from filter', result);
           res.render('pages/search', {
               user: req.session.userData,
               searchValue: req.query.search,
               documents: result
           });
        });
    }else{
        res.render('pages/search', {user: req.session.userData, searchValue: '', documents:[]});
    }
});

app.get('/logout', function(req, res){
    delete req.session.userKey;
    delete req.session.userData;
    console.log(req.session);
    res.redirect('/');
});

app.route('/')
  .get(function(req, res){
      if(typeof req.session.userData !== 'undefined'){
          res.redirect('/dashboard');
      }else{
          res.render('pages/index', {errors: ['', ''], message: '' } );
      }
  })
  .post(function(req, res) {

      const email = req.body.email;
      const password = req.body.password;

      //console.log(req.body);


      const result = userModel.signIn(email, password, function(result){
          console.log('Result is = ',result);
          if(result.status == 'success') {
              //We save the user session details

              req.session.isLoggedIn = true;
              req.session.userKey = result.data[0];
              req.session.userData = result.data[1];

              res.redirect('/dashboard');

          }else{
              res.render('pages/index', { errors: result.data, message: result.message});
          }
      });



  });

app.listen(3000, function(){
    console.log('Application listening on port 3000!');
});