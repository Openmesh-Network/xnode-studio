const fs = require('fs');
const path = require('path');

const sourceDir = './utils/'
const sourceName = 'template-definitions.json';  
const sourceFile = path.join(sourceDir, sourceName);

fs.readFile(sourceFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }
  
   
    let jsonData = JSON.parse(data);
  
    // Sort the JSON data, moving items with "implementation": false to the bottom
    jsonData.sort((a, b) => {
      return (a.implementation === b.implementation) ? 0 : a.implementation ? -1 : 1;
    });
  
    
    fs.writeFile(sourceFile, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing the file:', err);
        return;
      }
      console.log('File has been sorted and saved.');
    });
  });