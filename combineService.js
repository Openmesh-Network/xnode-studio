const fs = require('fs');
const path = require('path');

const sourceDir = './utils/definitions/'
const outputDir = './utils'
const outputFileName = 'service-definitions.json';  
const outputFile = path.join(outputDir, outputFileName);

const combineJsonFiles = () => {
  
  fs.readdir(sourceDir, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${sourceDir}: ${err}`);
      return;
    }

    const jsonFiles = files.filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
      console.warn(`No JSON files found in ${sourceDir}`);
      return;
    }

    
    const combinedData = [];

   
    jsonFiles.forEach(file => {
      const filePath = path.join(sourceDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);
      combinedData.push(jsonData);
    });

    
    fs.writeFileSync(outputFile, JSON.stringify(combinedData, null, 2));
    console.log(`Combined JSON file created: ${outputFile}`);
  });
};

combineJsonFiles();
