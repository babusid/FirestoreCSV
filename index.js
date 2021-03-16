const admin = require('firebase-admin');
const { firestore } = require('firebase-admin');
const readline = require("readline");
const questionAsync = require("./readline-ext");
const fs = require('fs');
const databaseData = require('./info.json');



const init = async()=>{
   console.log("For ease of use, I recommend having the following two files in the same directory as this program: \ninfo.json, and the CSV file you are using");
    //create input interface
   const input = readline.createInterface(
        process.stdin,
        process.stdout
    );
    //find csv filepath and datamode to use
    const dataCSV = await input.questionAsync("What is the Filepath of the CSV file?: ");
    let dataMode = await input.questionAsync("What is the datamode (Upload/Download)?: ");
    while(1){
        if(dataMode!="Upload"&&dataMode!="Download"){
            console.log("You must pick either 'Upload' or 'Download' (it is case-sensitive)");
            dataMode = await input.questionAsync("What is the datamode (Upload/Download)?: ");
        } else {
            break;
        }
    }
    
    //setup database credentials
    const serviceAccount = databaseData.serviceAccount;
    const databaseURL = databaseData.databaseURL;
    try{
        admin.initializeApp({
            credential: serviceAccount,
            databaseURL: databaseURL,
        });
    } catch (error){
        console.log("Did you fill out info.json?");
        console.log("ERROR FROM FIRESTORE SDK:");
        console.log(error);
        process.exit(1);
    }
    const db = admin.firestore;

    //run main func with filepath
    main(dataCSV,dataMode,db);
}

/**
 * 
 * @param {String} dataCSV Filepath to Data Location
 * @param {String} dataMode Whether or not data should be Uploaded from firestore or uploaded to firestore
 * @param {admin.firestore} db Firestore Database to upload/download from
 */
const main = (dataCSV,dataMode,db) =>{
    let filestream;
    if (dataMode=="Upload"){
        try{
            filestream = fs.createReadStream(dataCSV, { flags: "r" });
        } catch(err){
            console.log("The Given CSV file does not seem to exist. \nPlease ensure you have provided a valid CSV file, and relaunch this application. \nThis window will quit in 5 seconds")
            setTimeout(()=>{
                process.exit(0)
            },5000)
        }
        csvToFirestore(filestream,db);
    } else {
        console.log("Download Mode is not yet built.")
        process.exit(0);
        firestoreToCSV(filestream,db);
    }

}

/**
 * @brief Function to upload CSV file to the firestore database
 * @param {fs.Interface.createReadStream} filestream  Filesystem readstream to use in order to parse CSV and upload to firestore database
 * @param {admin.firestore} db Firestore Database
 */
const csvToFirestore =(filestream,db)=>{
    
}



//Runtime
init();
