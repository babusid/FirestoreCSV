const admin = require('firebase-admin');
const { firestore } = require('firebase-admin');
const readline = require("readline");
const csv = require('csv-parser');
const fs = require('fs');
const databaseData = require('./info.json');


const init = async()=>{
   //create input interface
   const input = readline.createInterface(
        process.stdin,
        process.stdout
    );
    //find csv filepath and datamode to use
    const dataCSV = await questionAsync(input, "What is the Filepath of the CSV file?: ");
    let dataMode = await questionAsync(input, "What is the datamode (Import/Export)?: ");
    while(1){
        if(dataMode!="Import"&&dataMode!="Export"){
            console.log("You must pick either 'Import' or 'Export' (it is case-sensitive)");
            dataMode = await questionAsync(input, "What is the datamode (Import/Export)?: ");
        } else {
            break;
        }
    }
    
    //setup database credentials
    // const serviceAccount = databaseData.serviceAccount;
    // const databaseURL = databaseData.databaseURL;
    // try{
    //     admin.initializeApp({
    //         credential: serviceAccount,
    //         databaseURL: databaseURL,
    //     });
    // } catch (error){
    //     console.log("Did you fill out info.json?");
    //     console.log("ERROR FROM FIRESTORE SDK:");
    //     console.log(error);
    //     process.exit(1);
    // }
    // const db = admin.firestore;

    //run main func with filepath
    main(dataCSV,dataMode);
}

/**
 * 
 * @param {String} dataCSV Filepath to Data Location
 * @param {String} dataMode Whether or not data should be imported from firestore or uploaded to firestore
 */
const main = (dataCSV,dataMode) =>{
}

/**
 * 
 * @param {readline.Interface} input readline interface to use in prompting user 
 * @param {String} query String to prompt user with
 * @returns 
 */
const questionAsync = (input,query) =>{
    let ret = new Promise((resolve)=>{
        input.question(`${query}`,(answer)=>{
            resolve(answer);
        });
    })
    return ret;
}

//Runtime
init();
