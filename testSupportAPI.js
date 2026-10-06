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
    console.log('--- STARTING FRONTEND STEP 11 SUPPORT TESTS ---');
    
    // Static Checks
    const routerPath = path.join(__dirname, 'src', 'app', 'router.jsx');
    const adminApiPath = path.join(__dirname, 'src', 'services', 'adminApi.js');
    
    const rContent = fs.readFileSync(routerPath, 'utf8');
    const aaContent = fs.readFileSync(adminApiPath, 'utf8');

    // Routing
    assert(rContent.includes('AdminSupportDashboard'), 'Admin Support Dashboard mapped');
    assert(rContent.includes('AdminSupportTickets'), 'Admin Support Tickets list mapped');
    assert(rContent.includes('AdminSupportTicketDetails'), 'Admin Support Ticket details mapped');

    // APIs
    assert(aaContent.includes('/admin/support/stats'), 'Support Stats API integrated');
    assert(aaContent.includes('/admin/support/tickets'), 'Support Tickets API integrated');
    assert(aaContent.includes('/admin/support/tickets/${id}/messages'), 'Support Message API integrated');
    assert(aaContent.includes('/admin/support/tickets/${id}/status'), 'Support Status API integrated');
    assert(aaContent.includes('/admin/support/tickets/${id}/assign'), 'Support Assignment API integrated');
    assert(aaContent.includes('/admin/support/tickets/${id}/escalate'), 'Support Escalation API integrated');

    // Due to lack of authenticated environment
    markNotTested('Actual Support Stats GET');
    markNotTested('Actual Tickets List GET');
    markNotTested('Actual Ticket Details GET');
    markNotTested('Actual Message POST');
    markNotTested('Actual Status PATCH');
    markNotTested('Actual Assignment PATCH');
    markNotTested('Actual Escalation PATCH');

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
