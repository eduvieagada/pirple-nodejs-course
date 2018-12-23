/*
    Library for storing and editing data
*/

// dependencies
let fs = require('fs');
let path = require('path');

// container for the module to be exported
let lib = {};

// base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// write data to a file
lib.create = function (dir, file, data, callback) {
    // open the file for write

    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (err, fileDiscriptor) => {
        if (err && !fileDiscriptor) {
            callback('could not create file, it may already exist');
            return;
        }

        // convert data to string
        let stringData = JSON.stringify(data);

        //write to file and close it
        fs.writeFile(fileDiscriptor, stringData, (err) => {
            if (err) {
                callback('Error writing to new file');
                return;
            }

            fs.close(fileDiscriptor, (err) => {
                if (err) {
                    callback('Error closing new file');
                    return;
                }

                callback(false);
            })
        })
    });
};

// read data

lib.read = function (dir, file, callback) {
    fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf-8', (err, data) => {
        callback(err, data);
    });
};


// update data

lib.update = function (dir, file, data, callback) {
    // open the file for writing
    fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', function (err, fileDiscriptor) {
        if (err && !fileDiscriptor) {
            callback('could not open the file for update, it may not exist yet');
            return;
        }

        let stringData = JSON.stringify(data);

        fs.truncate(fileDiscriptor, (err) => {
            if (err) {
                callback('error truncating file');
                return;
            }

            fs.writeFile(fileDiscriptor, stringData, (err) => {
                if (err) {
                    callback('Error writing to existing file');
                    return;
                }

                fs.close(fileDiscriptor, (err) => {
                    if (err) {
                        callback('there was an error closing the file');
                        return;
                    }
                    callback(false);
                })
            })
        })
    });
};

lib.delete = function (dir, file, callback) {
    fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err) => {
        if (err) {
            callback('error deleting file');
            return;
        }
        callback(false);
    });
};


// Export the module
module.exports = lib;




