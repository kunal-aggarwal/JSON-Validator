const fs = require('fs');

compare();
async function compare(){
    var masterFile = await readFile("master.json");
    var payloadFile = await readFile("payload.json");
    if(masterFile === "undefined"){
        console.log("master.json is missing");
        return;
    }
    if(payloadFile === "undefined"){
        console.log("payload.json is missing");
        return;
    }
    
    var masterFileObject = JSON.parse(masterFile);
    var payloadFileObject = JSON.parse(payloadFile);
    
    var hierarchy =[];
    var extras =[];
 
    for(var key in masterFileObject){
        checkObjectProperty(masterFileObject, payloadFileObject, key, hierarchy, key);
    }

    for(var key in payloadFileObject){
        checkExtraProperties(payloadFileObject, masterFileObject, key, extras, key);
    }
    
    if(hierarchy.length > 0 || extras.length > 0){
        console.log("\x1b[91m",'Payload is non-conformant. Found the following discrepancies....');
    } else{
        console.log('No such discrepancy.... ');
    }
    
    var i=1;
    hierarchy.forEach(element => {
        console.log("\x1b[93m",(i +": "+ element));
        i++;
    });
    extras.forEach(element => {
        console.log("\x1b[36m",(i +": "+ element));
        i++;
    });
    console.log("\x1b[0m",'done..');     
}

function checkObjectProperty(master, payload, key, hierarchy, nestedKey){
    var temp = payload[key]; 
    if(typeof payload[key] === 'undefined'){
        hierarchy.push(nestedKey + " is missing");
    } else if (typeof master[key] === 'object'){
        if(typeof payload[key] !== 'object'){
            hierarchy.push(nestedKey + " must be an object");
            return;
        }

        if (Array.isArray(master[key])){
            if(!Array.isArray(payload[key])){
                hierarchy.push(nestedKey + " must be an array");
                return;
            }
            
            var newMaster = master[key][0];
            var i=0;
            payload[key].forEach(element => {
                var newPayload = element; 

                if(isPrimitive(newMaster)){
                    if(typeof newMaster !== typeof newPayload){
                        hierarchy.push(nestedKey +"["+i+"]"  + " must be a "+ typeof newMaster);
                    }
                    i++; // In case returned from here, need to increment i here itself;
                    return;
                }
                
                for(var newKey in newMaster){
                    var newNestedKey = nestedKey+"["+i+"]" +"."+newKey;
                    checkObjectProperty(newMaster, newPayload, newKey, hierarchy, newNestedKey);
                }  
                i++; 
            });
            
        }else{
            var newMaster = master[key];
            var newPayload = payload[key];
            for(var newKey in newMaster){
                var newNestedKey = nestedKey+"."+newKey;
                checkObjectProperty(newMaster, newPayload, newKey, hierarchy, newNestedKey);
            }
        } 
    } else if (isPrimitive(master[key]) &&
            (typeof master[key] !== typeof payload[key])){
        hierarchy.push(nestedKey + " must be a "+ typeof master[key]);
        return;
    }
}

function isPrimitive(object){
    var dataType = typeof object;
    return dataType === "string" || dataType === "number"
    || dataType === "boolean";
}

function checkExtraProperties(master, payload, key, hierarchy, nestedKey){
    if(typeof payload[key] === 'undefined'){
        hierarchy.push(nestedKey + " is redundant");
    } else if (typeof master[key] === 'object'){
        
        if(typeof payload[key] !== 'object'){
            return;
        }
        if (Array.isArray(master[key]) && !Array.isArray(payload[key])){
            return;
        }
        if (!Array.isArray(master[key]) && Array.isArray(payload[key])){
            return;
        }

        if (Array.isArray(master[key])){
            master[key].forEach(element => {
                var newMaster = element; 
                var newPayload = payload[key][0];        
                var i=0;

                if(typeof newMaster !== typeof newPayload){
                    return;
                }

                if(isPrimitive(newMaster)){
                    var newKey = i;
                    var newNestedKey = nestedKey+"["+i+"]";
                    checkExtraProperties(newMaster, newPayload, newKey, hierarchy, newNestedKey);
                    return;
                }

                for(var newKey in newMaster){
                    var newNestedKey = nestedKey+"["+i+"]" +"."+newKey;
                    checkExtraProperties(newMaster, newPayload, newKey, hierarchy, newNestedKey);
                    i++;
                }  
            });
        } else{
            var newMaster = master[key];
            var newPayload = payload[key];
            for(var newKey in newMaster){
                var newNestedKey = nestedKey+"."+newKey;
                checkExtraProperties(newMaster, newPayload, newKey, hierarchy, newNestedKey);
            }
        } 
    } else if (typeof master[key] === 'string'){
        if(typeof payload[key] !== 'string'){
            return;
        }
    } else if (typeof master[key] === 'number'){
        if(typeof payload[key] !== 'number'){
            return;
        }
    } else if (typeof master[key] === 'boolean'){
        if(typeof payload[key] !== 'boolean'){
            return;
        }
    }
}

async function readFile(fileName){
   var fileData;
    await readFileFromDisk(fileName).then(function(data){
        fileData = data;
    }).catch(function (err) {
        console.log(fileName + " file could not be read");
        fileData='undefined';
   });
   //console.log("fileData" + fileData);
   return fileData;
}

async function readFileFromDisk(fileName){ 
    return new Promise (function(resolve, reject) {
        fs.readFile(fileName, 'utf8', function(err, data){ 
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        })
    });
}
