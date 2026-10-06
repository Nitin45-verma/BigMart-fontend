import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const results = {};

const assert = (condition, message) => {
  if (condition) {
    results[message] = 'PASS';
  } else {
    results[message] = 'FAIL';
    console.error(`Assertion failed: ${message}`);
  }
};

const markNotTested = (message) => {
  results[message] = 'NOT TESTED — authentication/test-user restriction';
};

const runTests = async () => {
  try {
    console.log('--- STARTING FRONTEND STEP 11 ADMIN COMPLETION TESTS ---');
    
    // Static Checks
    const routerPath = path.join(__dirname, 'src', 'app', 'router.jsx');
    const adminApiPath = path.join(__dirname, 'src', 'services', 'adminApi.js');
    
    const rContent = fs.readFileSync(routerPath, 'utf8');
    const aaContent = fs.readFileSync(adminApiPath, 'utf8');

    // Routing
    assert(rContent.includes('AdminSellers'), 'Admin Sellers route mapped');
    assert(rContent.includes('AdminCategories'), 'Admin Categories route mapped');
    assert(rContent.includes('AdminOrderDetails'), 'Admin Order Details route mapped');
    assert(rContent.includes('AdminReturns'), 'Admin Returns route mapped');
    assert(rContent.includes('AdminAnalytics'), 'Admin Analytics route mapped');
    assert(rContent.includes('AdminAuditLogs'), 'Admin Audit Logs route mapped');

    // APIs
    assert(aaContent.includes('/admin/sellers'), 'Sellers API integrated');
    assert(aaContent.includes('/admin/categories'), 'Categories API integrated');
    assert(aaContent.includes('/admin/orders/${id}'), 'Order Details API integrated');
    assert(aaContent.includes('/admin/returns'), 'Returns API integrated');
    assert(aaContent.includes('/admin/analytics'), 'Analytics API integrated');
    assert(aaContent.includes('/admin/audit-logs'), 'Audit Logs API integrated');

    // Due to lack of authenticated environment
    markNotTested('Actual Admin Auth Verification');
    markNotTested('Actual Sellers List GET');
    markNotTested('Actual Category Create POST');
    markNotTested('Actual Order Status PATCH');
    markNotTested('Actual Return Approve PATCH');
    markNotTested('Actual Analytics Overview GET');
    markNotTested('Actual Audit Logs GET');

    let passed = 0;
    let notTested = 0;
    let failed = 0;
    
    for (const [k, v] of Object.entries(results)) {
      if (v === 'PASS') passed++;
      else if (v.includes('NOT TESTED')) notTested++;
      else failed++;
    }
    
    console.log(`\nRESULTS: ${passed} PASS, ${failed} FAIL, ${notTested} NOT TESTED`);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runTests();
