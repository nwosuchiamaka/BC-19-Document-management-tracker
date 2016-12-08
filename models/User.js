const User = function(firebase) {
    const database = firebase.database();
    //const usersRef = database.ref('/users');
    return {

        signIn: function(email, password, callback){
            var errors = [];
            if(typeof email === 'undefined' || email.length < 1){
                errors.push('Email is required');
            }else if(!this.verifyEmail(email)){
                errors.push('Email is not valid');
            }

            if(typeof password === 'undefined' || password.length < 1){
                errors.push('Password is required');
            }

            if (errors.length < 1) {
                // user_key, user_data
                this.accountExists(email, password, function(accountExists, userKey, userData){
                    if(accountExists){
                        callback({
                            status: 'success',
                            message: 'Login successful',
                            data: [userKey, userData]
                        });
                    }else{
                        callback({
                            status: 'fail',
                            message: 'Invalid email and password combination',
                            data: errors
                        });
                    }
                });
            } else {
                callback({
                    status: 'fail',
                    message: 'Incorrect details',
                    data: errors
                });
            }

        },

        signedIn: function () {
            var username = window.localStorage.getItem('username');
            return ( username != undefined );
        },

        signUp: function(fullname, username, email, password, verifyPassword, callback){

            var errors = [];
            if(typeof fullname  === 'undefined' || fullname.length < 1){
                errors[0] = 'Full name is required';
            }


            if(typeof username  === 'undefined' || username.length < 1){
                errors[1] = 'Username is required';
            }

            if(typeof email  === 'undefined' || email.length < 1){
                errors[2] = 'Email is required';
            }else if(!this.verifyEmail(email)){
                errors[2] = 'Email is not valid';
            }

            if(typeof password  === 'undefined' || password.length < 1){
                errors[3] = 'Password is required';
            }

            if(typeof verifyPassword === 'undefined' || verifyPassword.length < 1){
                errors[4] = ('You need to retype password again');
            }else if(verifyPassword !== password){
                errors[4] = ('Password do not match');
            }

            if(errors.length < 1) {
                this.accountIsUnique(username, email, function(isUnique){
                    if(isUnique){
                        var newUserKey = database.ref('users').push().key;

                        callback({
                            status: 'success',
                            data: database.ref( 'users' + '/' + newUserKey).set({
                                fullname: fullname,
                                username: username,
                                email : email,
                                password: password
                            }),
                            message: 'Account created'
                        });
                    }else{
                        callback({
                            status: 'fail',
                            message: 'User already exists',
                            data: []
                        });
                    }
                });

            }else{
                callback({
                    status: 'fail',
                    message: 'Unable to create account',
                    data: errors
                });
            }


        },


        accountIsUnique : function(username, email, callback){
            database.ref('users').once('value', function(users){
                var userValues = users.val();
                for(var i in userValues) {
                    if( userValues[i].username == username || userValues[i].email == email ){
                        callback(false);
                        return;
                    }
                }
                callback(true);
            });
        },


        accountExists: function(email, password, callback){
            database.ref('users').once('value', function(users){
                console.log('Tried to get value from user');
                var userValues = users.val();
                for(var i in userValues) {
                    if(userValues.hasOwnProperty(i)){
                        if( userValues[i].email == email && userValues[i].password == password ){
                            callback(true, i, userValues[i] );
                            return;
                        }
                    }

                }
                callback(false);
            });
        },

        verifyEmail : function(email) {

            const re = /[a-z,0-9]/ig;
            const dotPos = email.lastIndexOf('.');
            const atPos = email.lastIndexOf('@');
            const wsp = email.lastIndexOf(' ');
            const atPosMinus = email.substring(atPos - 1, atPos);
            return (atPos > 0 && dotPos > atPos && wsp < 0 && re.test(atPosMinus));

        }

    }
};

module.exports = User;