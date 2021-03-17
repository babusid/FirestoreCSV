const admin = require('firebase-admin');
const { firestore } = require('firebase-admin');
const readline = require("readline");
require("./readline-ext"); //async extension for readline
const fs = require('fs');
const databaseData = require('./info.json');
const CSVtoFirestore = require("./__components/CSVtoFirestore");

const main = async()=>{
   console.log("For ease of use, I recommend having the CSV file you are using in the same directory as this package.");
    //create input interface
   const input = readline.createInterface(
        process.stdin,
        process.stdout
    );

    //get all necessary data from user
    const databaseData = require(await input.questionAsync("What is the Filepath of the info.json? (file that contains service account information)"))
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
    let fileMode = await input.questionAsync("What is the file mode? (Does all of the data in this CSV go into/come from the same collection, or is it a multicollection sheet?) (1/2)");
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
        console.log("Multi-collection support has not yet been built. This program will stop in ten seconds.");
        setTimeout(() => {
            process.exit(1)
        }, 10000);
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
    if (dataMode=="Upload"){
        if (fileMode=="1"){CSVtoFirestore.uploadSingleCollection(dataCSV,collection,db);}
        else if (fileMode=="2"){CSVtoFirestore.uploadMultipleCollection(dataCSV,db);}
    } else {
        console.log("Download Mode is not yet built.");
        process.exit(1);
        firestoreToCSV(filestream,db);
    }
}

//Runtime
main();
