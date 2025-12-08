import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '10s', target: 5 },   // Ramp up to 5 users over 10 seconds
    { duration: '30s', target: 5 },   // Stay at 5 users for 30 seconds
    { duration: '10s', target: 10 },  // Ramp up to 10 users over 10 seconds
    { duration: '1m', target: 10 },   // Stay at 10 users for 1 minute
    { duration: '10s', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
    errors: ['rate<0.1'],             // Custom error rate should be less than 10%
  },
};

const BASE_URL = 'http://10.10.110.7:3000';

export default function () {
  // Test 1: Search time record by workplace
  const payload1 = JSON.stringify({
    workplaceId: '10426',
    month: '10',
    year: '2025',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response1 = http.post(
    `${BASE_URL}/accounting/searchtimerecordbyworkplace`,
    payload1,
    params
  );

  // Check response
  const result1 = check(response1, {
    'API 1: status is 200': (r) => r.status === 200,
    'API 1: response time < 500ms': (r) => r.timings.duration < 500,
    'API 1: response time < 1000ms': (r) => r.timings.duration < 1000,
    'API 1: has response body': (r) => r.body.length > 0,
  });

  // Record errors
  errorRate.add(!result1);

  // Think time - simulate user reading/processing the response
  sleep(1);

  // TODO: Add your second API endpoint here
  // Example:
  // const response2 = http.post(`${BASE_URL}/your-second-endpoint`, payload2, params);
  // check(response2, { ... });
}

// Setup function - runs once at the beginning
export function setup() {
  console.log('Starting load test...');
  console.log(`Target URL: ${BASE_URL}`);
  console.log('Test will run with ramping users from 10 to 100');
}

// Teardown function - runs once at the end
export function teardown(data) {
  console.log('Load test completed!');
}
