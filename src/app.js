const express = require('express');
const dotenv = require('dotenv');
const db = require('./database');
const csvParser = require('./csvParser');
const ageDistribution = require('./ageDistribution');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/upload', async (req, res) => {
  try {
    // Parse CSV file
    const jsonData = await csvParser.parseCSV(process.env.CSV_FILE_PATH);

    // Insert data into the database
    await db.insertData(jsonData);

    // Calculate age distribution
    const report = await ageDistribution.calculateAgeDistribution();

    // Print the report
    console.log(report);

    res.status(200).json({ message: 'Data processed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});