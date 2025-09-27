const fs = require('fs');
const { parse } = require('csv-parse'); // Fixed import
const mongoose = require('mongoose');
require('dotenv').config();

// Content Schema
const contentSchema = new mongoose.Schema({
  show_id: String,
  type: { type: String, enum: ['Movie', 'TV Show'] },
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String
});

const Content = mongoose.model('Content', contentSchema);

async function importCSVData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing content
    await Content.deleteMany({});
    console.log('Cleared existing content');

    // Read and parse CSV
    const results = [];
    
    fs.createReadStream('./netflix_titles.csv') // Make sure your CSV file is here
      .pipe(parse({ 
        columns: true,
        skip_empty_lines: true,
        delimiter: ','
      }))
      .on('data', (data) => {
        results.push({
          show_id: data.show_id,
          type: data.type,
          title: data.title,
          director: data.director || 'Unknown',
          cast: data.cast || 'Unknown',
          country: data.country || 'Unknown',
          date_added: data.date_added,
          release_year: parseInt(data.release_year) || 0,
          rating: data.rating || 'Not Rated',
          duration: data.duration,
          listed_in: data.listed_in,
          description: data.description || 'No description available'
        });
      })
      .on('end', async () => {
        try {
          console.log(`Processing ${results.length} records...`);
          // Insert all content in batches
          await Content.insertMany(results);
          console.log(`✅ Successfully imported ${results.length} Netflix items!`);
          mongoose.connection.close();
        } catch (error) {
          console.error('Error inserting data:', error);
          mongoose.connection.close();
        }
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        mongoose.connection.close();
      });

  } catch (error) {
    console.error('Connection error:', error);
  }
}

importCSVData();
