const logger = require('./utils/logger');

console.log('\n🧪 Testing Winston Logger...\n');

// Test different log levels
logger.debug('🔍 This is a DEBUG message - สำหรับ development เท่านั้น');
logger.info('ℹ️ This is an INFO message - แสดงทั้ง dev และ production');
logger.warn('⚠️ This is a WARN message - คำเตือน');
logger.error('❌ This is an ERROR message - ข้อผิดพลาด');

// Test accounting helpers
logger.accounting.start('searchtimerecordemployee', { 
  workplaceId: '1001', 
  year: '2025', 
  month: '11' 
});

logger.accounting.workplace('Processing workplace 1001', { 
  employeeCount: 23 
});

logger.accounting.employee('Calculating salary for employee', { 
  employeeId: '1001',
  name: 'ทดสอบ ทด' 
});

logger.accounting.success('searchtimerecordemployee', { 
  recordsProcessed: 23,
  duration: '2.5s' 
});

console.log('\n✅ Logger test completed!');
console.log('📁 Check logs in: /Users/Macbook/fdOwat/owatmaid-api/logs/');
console.log('\n💡 Log levels:');
console.log('   - debug: จะแสดงเฉพาะเมื่อ NODE_ENV=development');
console.log('   - info: แสดงทั้ง development และ production');
console.log('   - warn/error: แสดงเสมอ\n');
