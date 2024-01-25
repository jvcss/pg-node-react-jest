const express = require('express');
const { exec } = require('child_process');
const supertest = require('supertest');
const exp = require('constants');

function createHealthCheckRouter() {
  const healthCheckRouter = express.Router();

  healthCheckRouter.get('/', async (req, res) => {
    // Run Jest tests
    const jestProcess = exec('npm test');

    jestProcess.on('exit', async (code) => {
      if (code === 0) {
        // Tests passed
        const testResults = await supertest(app).get('/healthz/test-results');
        res.status(200).json({ status: 'success', testResults });
      } else {
        // Tests failed
        res.status(500).json({ status: 'failure', error: 'Tests failed' });
      }
    });
  });

  // Additional route to expose test results for badge
  healthCheckRouter.get('/test-results', async (req, res) => {
    const testResults = await supertest(app).get('/healthz/test-results');
    res.json(testResults.body);
  });

  return healthCheckRouter;
}

exports.createHealthCheckRouter = createHealthCheckRouter;