const admin = require('firebase-admin');
const { firestore } = require('firebase-admin');
const readline = require("readline");
const csv = require('csv-parser');
const fs = require('fs');
const databaseData = require('./info.json');
const dataMode = "";


const init = ()=>{
   //create input interface
   const input = readline.createInterface(
        process.stdin,
        process.stdout
    );
    //find csv filepath to use
    let dataCSV = new Promise((resolve)=>{
        input.question("What is the relative path of the CSV file?: ",(answer)=>{
            resolve(answer);
        });
    })

    
    //setup database reference
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
        process.exit();
    }
    const db = admin.firestore;
    
    //run main func with filepath
    dataCSV.then(
        (value)=>{
            input.close(); //close input
            main(value,);
        },
        (reason)=>{
            console.log("given filepath was rejected")
            console.log(`ERROR: ${reason}`)
        }
    )
}

const uploadCSVtoFirestore =()=>{}
const downloadFirestoretoCSV =()=>{}
init();
main();