/**
 * Script to add database indexes for performance optimization
 * Run this once to add indexes to MongoDB collections
 * 
 * Usage: node scripts/add_database_indexes.js
 */

const mongoose = require('mongoose');
const connectionString = require('../config');

async function addIndexes() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // ===================================
    // Timerecord Employee Collection
    // ===================================
    console.log('\n📊 Adding indexes to periodtimerecordemployees collection...');
    
    const timerecordEmployeeCollection = db.collection('periodtimerecordemployees');
    
    // Index for employee queries
    await timerecordEmployeeCollection.createIndex(
      { employeeId: 1 },
      { background: true, name: 'idx_employeeId' }
    );
    console.log('✅ Created index: employeeId');

    // Compound index for common queries (month + year + employeeId)
    await timerecordEmployeeCollection.createIndex(
      { month: 1, timerecordId: 1, employeeId: 1 },
      { background: true, name: 'idx_month_year_employee' }
    );
    console.log('✅ Created compound index: month + timerecordId + employeeId');

    // Index for migration query
    await timerecordEmployeeCollection.createIndex(
      { typeOfemployee: 1 },
      { background: true, name: 'idx_typeOfemployee', sparse: true }
    );
    console.log('✅ Created index: typeOfemployee');

    // ===================================
    // Timerecord Workplace Collection
    // ===================================
    console.log('\n📊 Adding indexes to periodworkplacetimerecords collection...');
    
    const timerecordWorkplaceCollection = db.collection('periodworkplacetimerecords');
    
    // Index for workplace queries
    await timerecordWorkplaceCollection.createIndex(
      { workplaceId: 1 },
      { background: true, name: 'idx_workplaceId' }
    );
    console.log('✅ Created index: workplaceId');

    // Compound index for date + workplace queries
    await timerecordWorkplaceCollection.createIndex(
      { date: 1, workplaceId: 1 },
      { background: true, name: 'idx_date_workplace' }
    );
    console.log('✅ Created compound index: date + workplaceId');

    // ===================================
    // Conclude Records Collection
    // ===================================
    console.log('\n📊 Adding indexes to concluderecords collection...');
    
    const concludeCollection = db.collection('concluderecords');
    
    // Index for employee queries
    await concludeCollection.createIndex(
      { employeeId: 1 },
      { background: true, name: 'idx_employeeId' }
    );
    console.log('✅ Created index: employeeId');

    // Compound index for common queries (year + month + employeeId)
    await concludeCollection.createIndex(
      { year: 1, month: 1, employeeId: 1 },
      { background: true, name: 'idx_year_month_employee' }
    );
    console.log('✅ Created compound index: year + month + employeeId');

    // Index for date queries
    await concludeCollection.createIndex(
      { concludeDate: -1 },
      { background: true, name: 'idx_concludeDate' }
    );
    console.log('✅ Created index: concludeDate (descending)');

    // ===================================
    // Employee Collection
    // ===================================
    console.log('\n📊 Adding indexes to employees collection...');
    
    const employeeCollection = db.collection('employees');
    
    // Index for workplace queries
    await employeeCollection.createIndex(
      { workplace: 1 },
      { background: true, name: 'idx_workplace' }
    );
    console.log('✅ Created index: workplace');

    // Index for jobtype
    await employeeCollection.createIndex(
      { jobtype: 1 },
      { background: true, name: 'idx_jobtype' }
    );
    console.log('✅ Created index: jobtype');

    // ===================================
    // Workplace Collection
    // ===================================
    console.log('\n📊 Adding indexes to workplaces collection...');
    
    const workplaceCollection = db.collection('workplaces');
    
    // Index for workplaceId
    await workplaceCollection.createIndex(
      { workplaceId: 1 },
      { background: true, name: 'idx_workplaceId', unique: true }
    );
    console.log('✅ Created unique index: workplaceId');

    // ===================================
    // List all indexes
    // ===================================
    console.log('\n📋 Listing all indexes...');
    
    const collections = [
      { name: 'periodtimerecordemployees', collection: timerecordEmployeeCollection },
      { name: 'periodworkplacetimerecords', collection: timerecordWorkplaceCollection },
      { name: 'concluderecords', collection: concludeCollection },
      { name: 'employees', collection: employeeCollection },
      { name: 'workplaces', collection: workplaceCollection }
    ];

    for (const { name, collection } of collections) {
      console.log(`\n📂 ${name}:`);
      const indexes = await collection.indexes();
      indexes.forEach(idx => {
        console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
      });
    }

    console.log('\n✅ All indexes created successfully!');
    console.log('\n💡 Tips:');
    console.log('   - Indexes are created in background mode');
    console.log('   - Monitor query performance with: db.collection.explain()');
    console.log('   - Check index usage with: db.collection.aggregate([{$indexStats:{}}])');

  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the script
addIndexes();
