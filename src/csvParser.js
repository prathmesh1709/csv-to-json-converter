const fs = require('fs');
const path = require('path');

const parseCSV = async (filePath) => {
  const fileContent = await fs.promises.readFile(path.resolve(filePath), 'utf-8');
  const lines = fileContent.trim().split('\n');

  const headers = lines[0].split(',');
  const jsonData = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    const obj = {};

    for (let j = 0; j < headers.length; j++) {
      const [rootProp, subProp] = headers[j].split('.');
      const value = currentLine[j];

      if (subProp) {
        obj[rootProp] = obj[rootProp] || {};
        obj[rootProp][subProp] = value;
      } else {
        obj[rootProp] = value;
      }
    }

    jsonData.push(obj);
  }

  return jsonData;
};

module.exports = { parseCSV };