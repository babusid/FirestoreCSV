const admin = require('firebase-admin');
const { firestore } = require('firebase-admin');
const readline = require("readline");
require("./readline-ext"); //async extension for readline
const fs = require('fs');
const csvParser = require('csv-parser');
const databaseData = require('./info.json');



const main = async()=>{
   console.log("For ease of use, I recommend having the following two files in the same directory as this program: \ninfo.json, and the CSV file you are using");
    //create input interface
   const input = readline.createInterface(
        process.stdin,
        process.stdout
    );

    //get all necessary data from user
    const dataCSV = await input.questionAsync("What is the Filepath of the CSV file?: ");
    let dataMode = await input.questionAsync("What is the data mode (Upload/Download)?: ");
    while(1){
        if(dataMode!="Upload"&&dataMode!="Download"){
            console.log("You must pick either 'Upload' or 'Download' (it is case-sensitive)");
            dataMode = await input.questionAsync("What is the datamode (Upload/Download)?: ");
        } else {
            break;
        }
    }
    let fileMode = await input.questionAsync("What is the file mode? Does all of the data in this CSV go into/come from the same collection, or is it a multicollection sheet? (1/2)");
    while(1){
        if(fileMode!="1"&&fileMode!="2"){
            console.log("You must pick either 1 or 2 to indicate the file mode");
            fileMode = await input.questionAsync("What is the file mode? Does all of the data in this CSV go into the same collection, or is it a multicollection sheet? (1/2)");
        } else {
            break;
        }
    }
    let collection;
    if (fileMode=="1"){
        collection=await input.questionAsync("What is the collection name?");
    }else{
        console.log("Since you have selected multi-collection, this program will be slower.");
    }
    
    //setup database credentials and initialize
    try{
        admin.initializeApp({
            credential: admin.credential.cert(databaseData.serviceAccount)
        });
    } catch (error){
        console.log("Did you fill out info.json?");
        console.log("ERROR FROM FIRESTORE SDK:");
        console.log(error);
        process.exit(1);
    }
    const db = admin.firestore();

    let filestream;
    if (dataMode=="Upload"){
        filestream = fs.createReadStream(dataCSV, { flags: "r" }).on('error',()=>{
            console.log("You seem to have input a non-existent filepath.\n Please verify filepath is correct and run this program again.\n This process will exit in 10 seconds");
            setTimeout(() => {
                process.exit(0);
            }, 10000);
        });
        csvToFirestore(filestream,fileMode,collection,db);
    } else {
        console.log("Download Mode is not yet built.");
        process.exit(0);
        firestoreToCSV(filestream,db);
    }
}


/**
 * @brief Function to upload CSV file to the firestore database
 * @param {fs.ReadStream} filestream  Filesystem readstream to use in order to parse CSV and upload to firestore database
 * @param {String} filemode String 1/2 which chooses between single-collection CSV and multi-collection CSV where each row has the collection name 
 * @param {String} collection String which holds the collection name if single-collection, else is undefined
 * @param {firestore.Firestore} db Firestore Database
 */
const csvToFirestore = async(filestream,fileMode,collection,db)=>{
    let docArr = []; //holds all the rows of the CSV as individual document objects
    //make sure that filestream is open
    await new Promise(
        (resolve)=>{
            filestream.on('open', resolve);
        }
    );
    //create filestream pipe to csvParser
    const csvParse = filestream.pipe(csvParser());
    //parse each row of csv into json and push into an array
    csvParse.on
    ('data',
        (row)=>{
            docArr.push(row);
            //console.log(docArr);
        }
    );
    //now that docArray is filled, go through, establish a reference to the collection of each entry, and upload the doc to that collection
    csvParse.on('end',
    async()=>{
        console.log("Finished Parsing CSV");
        if (fileMode=="1"){ //single-collection sheet
            let promiseArr = []
            docArr.map(
                async(elem)=>{
                    //TODO: add overwrite protection
                    const elemProm = db.collection(collection).doc(`${elem.id}`).set(elem, {merge: true});
                    promiseArr.push(elemProm);
                    
                })
            //wait for promiseArr to resolve everything here and then exit
            Promise.all(promiseArr).then(
                ()=>{
                    process.exit(0)
                }  
            );

        } else if (fileMode=="2"){
            //multicollection sheet
            console.log("MultiCollection sheets are not yet supported");
            process.exit(0);
        }
    }
    )
}

//Runtime
main();
