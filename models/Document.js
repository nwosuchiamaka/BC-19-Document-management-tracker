const Document = function(firebase){
    const database = firebase.database();
    return {

        createDoc : function(ownerName, title, link, keyword, department, callback){
            var errors = [];

            if(typeof title === 'undefined' || title.length < 1){
                errors.push('Title is required');
            }

            if(typeof link === 'undefined' || link.length < 1){
                errors.push('Document link is required');
            }

            if(typeof keyword === 'undefined' || keyword.length < 1){
                errors.push('Enter a keyword for this document');
            }

            if(typeof department === 'undefined' || department.length < 1){
                errors.push('Select a department for this document');
            }

            if(errors.length < 1){
                this.documentExists(title, link, function(documentExists){
                    if(!documentExists){
                        var newDocumentKey = database.ref('documents').push().key;

                        database.ref( 'documents' + '/' + newDocumentKey).set({
                            title: title,
                            link: link,
                            keyword : keyword,
                            department: department,
                            owner: ownerName,
                            date: new Date()
                        })
                          .then(function(){
                            callback({
                                status: 'success',
                                message: 'Document created successfully',
                                data: newDocumentKey
                            })
                        }).catch(function(){
                            callback({
                                status: 'fail',
                                message: 'Unable to create document',
                                data: []
                            })
                        })

                    }else{
                        callback({
                            status: 'fail',
                            message: 'Document already exists',
                            data: []
                        });
                    }
                })
            }else{
                callback({
                    status: 'fail',
                    message: 'You have errors in form',
                    data: errors
                })
            }
        },

        getDocumentByDepartment: function(department, callback){
            var filteredDocuments = [];
            database.ref('documents').once('value', function(documents){
                var documentsValues = documents.val();
                console.log('Document got from db', documentsValues);
                for(var i in documentsValues) {
                    if(documentsValues.hasOwnProperty(i)){
                        documentsValues[i].id = i;
                        if( documentsValues[i].department.toLowerCase() === department ){
                            filteredDocuments.push(documentsValues[i]);
                        }
                    }
                }

                callback(filteredDocuments);
            });
        },

        getDocumentBykeyWord: function(keyword, callback){
            var filteredDocuments = [];
            database.ref('documents').once('value', function(documents){
                var documentsValues = documents.val();
                for(var i in documentsValues) {
                    if(documentsValues.hasOwnProperty(i)){
                        if( documentsValues[i].keyword == keyword ){
                            filteredDocuments.push(documentsValues[i]);
                        }
                    }

                }
                callback(filteredDocuments);
            });
        },

        getDocumentByTitle: function(title, callback){
            var filteredDocuments = [];
            database.ref('documents').once('value', function(documents){
                var documentsValues = documents.val();
                for(var i in documentsValues) {
                    if(documentsValues.hasOwnProperty(i)){
                        if( documentsValues[i].title == title ){
                            filteredDocuments.push(documentsValues[i]);
                        }
                    }

                }
                callback(filteredDocuments);
            });
        },

        getDocument: function(documentId, callback){
            database.ref('documents/'+ documentId).once('value', function(documents){
                var documentsValues = documents.val();
                callback(documentsValues);
            });
        },

        documentExists: function(title, link, callback){
            database.ref('documents').once('value', function(documents){
                var documentsValues = documents.val();
                for(var i in documentsValues) {
                    if(documentsValues.hasOwnProperty(i)){
                        if( documentsValues[i].title == title || documentsValues[i].link == link ){
                            callback(true, i, documentsValues[i] );
                            return;
                        }
                    }

                }
                callback(false);
            });
        },

        deleteDocument: function(documentId){

        }
    };
};

module.exports = Document;