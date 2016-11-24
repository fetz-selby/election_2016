 exports.getNonDuplicates = function(array){
        var unique = [];
        var elements = [];
        
        if(array.length > 0){
            array.forEach(function(element, index, arr){
                var id = element.id;
                
               if(unique.indexOf(id) === -1){
                   elements.push(element);
                   unique.push(id);
               }
            });
        }
        
        return elements;
 }
 
 exports.getHash = function(password){
    const crypto = require('crypto');

    const secret = 'thequickfoxjumpedoverthelazydog';
    //const secret = 'thequickbrownfoxjumpedoverthelazydog';
    const hash = crypto.createHmac('sha256', secret)
                   .update(password)
                   .digest('hex');
    return hash;
}


