const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Content = require('../models/Content');
require('dotenv').config();

console.log('🚀 FletNix Data Import Tool');
console.log('===========================');

const importCSVData = async (csvFilePath) => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB Atlas');

    const results = [];
    let validItems = 0;
    let invalidItems = 0;
    
    console.log(`📖 Reading CSV file: ${csvFilePath}`);
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
          // Clean and validate data
          const contentItem = {
            show_id: data.show_id?.trim(),
            type: data.type?.trim(),
            title: data.title?.trim(),
            director: data.director?.trim() || '',
            cast: data.cast?.trim() || '',
            country: data.country?.trim() || '',
            date_added: data.date_added?.trim() || '',
            release_year: parseInt(data.release_year) || null,
            rating: data.rating?.trim() || '',
            duration: data.duration?.trim() || '',
            listed_in: data.listed_in?.trim() || '',
            description: data.description?.trim() || ''
          };
          
          // Validate required fields
          if (contentItem.show_id && contentItem.type && contentItem.title && 
              (contentItem.type === 'Movie' || contentItem.type === 'TV Show')) {
            results.push(contentItem);
            validItems++;
          } else {
            invalidItems++;
            console.log(`⚠️  Skipping invalid item: ${contentItem.title || 'Unknown'}`);
          }
        })
        .on('end', async () => {
          try {
            console.log(`\n📊 Processing Summary:`);
            console.log(`   Valid items: ${validItems}`);
            console.log(`   Invalid items: ${invalidItems}`);
            console.log(`   Total processed: ${validItems + invalidItems}`);
            
            if (results.length === 0) {
              console.log('❌ No valid data found to import');
              process.exit(1);
            }
            
            console.log('\n🗑️  Clearing existing content...');
            await Content.deleteMany({});
            console.log('✅ Existing content cleared');
            
            console.log('\n📥 Importing new content...');
            const batchSize = 1000;
            let totalInserted = 0;
            
            for (let i = 0; i < results.length; i += batchSize) {
              const batch = results.slice(i, i + batchSize);
              try {
                const insertResult = await Content.insertMany(batch, { ordered: false });
                totalInserted += insertResult.length;
                console.log(`   📦 Batch ${Math.floor(i/batchSize) + 1}: ${insertResult.length} items (${totalInserted}/${results.length})`);
              } catch (error) {
                console.error(`   ❌ Error in batch ${Math.floor(i/batchSize) + 1}:`, error.message);
              }
            }
            
            console.log(`\n🎉 Import completed!`);
            console.log(`   📊 Successfully imported: ${totalInserted} items`);
            
            // Create search indexes
            console.log('\n🔍 Creating search indexes...');
            try {
              await Content.collection.createIndex({
                title: 'text',
                cast: 'text', 
                description: 'text'
              });
              console.log('✅ Text search index created');
            } catch (indexError) {
              console.log('⚠️  Index already exists or failed to create:', indexError.message);
            }
            
            // Show statistics
            console.log('\n📈 Content Statistics:');
            const movieCount = await Content.countDocuments({ type: 'Movie' });
            const tvShowCount = await Content.countDocuments({ type: 'TV Show' });
            const rRatedCount = await Content.countDocuments({ rating: 'R' });
            
            console.log(`   🎬 Movies: ${movieCount}`);
            console.log(`   📺 TV Shows: ${tvShowCount}`);
            console.log(`   🔞 R-Rated: ${rRatedCount}`);
            
            console.log('\n✅ Database setup complete!');
            console.log('🚀 Ready to start the backend server!');
            console.log('\n💡 Next steps:');
            console.log('   1. Run: npm run dev');
            console.log('   2. Test: http://localhost:5000/health');
            console.log('   3. Start building the frontend!');
            
            process.exit(0);
          } catch (error) {
            console.error('❌ Error importing data:', error);
            process.exit(1);
          }
        })
        .on('error', (error) => {
          console.error('❌ CSV parsing error:', error);
          reject(error);
        });
    });
  } catch (error) {
    console.error('❌ Database connection error:', error);
    console.log('💡 Check your MongoDB connection string in .env file');
    console.log('💡 Make sure to replace <db_password> with your actual password');
    process.exit(1);
  }
};

// Get CSV file path from command line
const csvFilePath = process.argv[2];

if (!csvFilePath) {
  console.error('❌ Please provide CSV file path');
  console.log('\n💡 Usage:');
  console.log('   node scripts/importData.js <path-to-csv-file>');
  console.log('\n📄 Example:');
  console.log('   node scripts/importData.js netflix_titles.csv');
  process.exit(1);
}

if (!fs.existsSync(csvFilePath)) {
  console.error(`❌ File not found: ${csvFilePath}`);
  console.log('💡 Make sure the CSV file path is correct');
  process.exit(1);
}

console.log('\n🎯 Starting import process...');
importCSVData(csvFilePath);
