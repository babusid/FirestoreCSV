const admin = require('firebase-admin');
const { firestore } = require('firebase-admin');
const fs = require('fs');
const csvParser = require('csv-parser');


/**
 * @brief Function to upload CSV file to the firestore database where the CSV file holds data intended for a single-collection
 * @param {String} collection String which holds the collection name
 * @param {firestore.Firestore} db Firestore Database
 */
const uploadSingleCollection = async(collection,db)=>{
    const filestream = fs.createReadStream(dataCSV, { flags: "r" }).on('error',()=>{
        console.log("You seem to have input a non-existent filepath for the data CSV.\n Please verify filepath is correct and run this program again.\n This process will exit in 10 seconds");
        setTimeout(() => {
            process.exit(0);
        }, 10000);
    });
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
    ()=>{
        console.log("Finished Parsing CSV");
        let promiseArr = []
        docArr.map(
            (elem)=>{
                //TODO: add overwrite protection
                const elemProm = db.collection(collection).doc(`${elem.id}`).set(elem, {merge: true});
                promiseArr.push(elemProm);  
            }
        )
        //wait for promiseArr to resolve everything here and then exit
        Promise.all(promiseArr).then(
            ()=>{
                process.exit(0)
            }  
        );
    }
    )
}

/**
 * @brief Function to upload a CSV file holding rows where the elements belong to multiple collections.
 * @param {firestore.Firestore} db Database to push the data to
 */
const uploadMultipleCollection = (db) =>{
    console.log("Uploading multiple collection csv's hasn't been built yet")
}