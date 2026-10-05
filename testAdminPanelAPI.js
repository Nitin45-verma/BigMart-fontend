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
    console.log('--- STARTING FRONTEND STEP 10 ADMIN PANEL TESTS ---');
    
    // Static Checks
    const routerPath = path.join(__dirname, 'src', 'app', 'router.jsx');
    const adminApiPath = path.join(__dirname, 'src', 'services', 'adminApi.js');
    const layoutPath = path.join(__dirname, 'src', 'pages', 'admin', 'AdminLayout.jsx');
    
    const rContent = fs.readFileSync(routerPath, 'utf8');
    const aaContent = fs.readFileSync(adminApiPath, 'utf8');
    const lContent = fs.readFileSync(layoutPath, 'utf8');

    // Routing & Roles
    assert(rContent.includes('allowedRoles={[\'admin\']}'), 'Admin route correctly protected with admin role');
    assert(rContent.includes('AdminDashboard'), 'Admin Dashboard route mapped');
    assert(rContent.includes('AdminUsers'), 'Admin Users route mapped');
    assert(rContent.includes('AdminSellerApplications'), 'Admin Seller Applications route mapped');
    assert(rContent.includes('AdminProducts'), 'Admin Products route mapped');
    assert(rContent.includes('AdminOrders'), 'Admin Orders route mapped');
    assert(rContent.includes('AdminFinance'), 'Admin Finance route mapped');

    // Layout
    assert(lContent.includes('ADMIN PANEL'), 'Admin Layout visually distinct');

    // APIs Configuration
    assert(aaContent.includes('/admin/dashboard/summary'), 'Dashboard API integrated');
    assert(aaContent.includes('/admin/users'), 'Users API integrated');
    assert(aaContent.includes('/admin/seller-applications'), 'Seller Applications API integrated');
    assert(aaContent.includes('/admin/products'), 'Products API integrated');
    assert(aaContent.includes('/admin/orders'), 'Orders API integrated');
    assert(aaContent.includes('/admin/finance/overview'), 'Finance API integrated');
    assert(aaContent.includes('/admin/users/${id}/block'), 'User blocking action mapped');
    assert(aaContent.includes('/admin/seller-applications/${id}/approve'), 'Application approval action mapped');

    // Due to lack of authenticated environment
    markNotTested('Actual Admin Auth Verification');
    markNotTested('Actual Dashboard Summary GET');
    markNotTested('Actual Users List GET');
    markNotTested('Actual User Block PATCH');
    markNotTested('Actual Seller Applications GET');
    markNotTested('Actual Seller App Approve PATCH');
    markNotTested('Actual Products GET');
    markNotTested('Actual Product Moderate PATCH');
    markNotTested('Actual Orders GET');
    markNotTested('Actual Finance Overview GET');

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
