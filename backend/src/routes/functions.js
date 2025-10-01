const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const vm = require('vm');

const router = express.Router();

// In-memory functions storage (in production, use a database)
const functions = [];

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all functions for user
router.get('/', verifyToken, (req, res) => {
  const userFunctions = functions.filter(func => func.userId === req.user.userId);
  res.json(userFunctions);
});

// Create new function
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, code, runtime = 'nodejs18.x', description = '' } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: 'Name and code are required' });
    }

    // Validate function name
    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
      return res.status(400).json({ 
        message: 'Function name can only contain letters, numbers, hyphens, and underscores' 
      });
    }

    // Check if function name already exists for this user
    const existingFunction = functions.find(
      func => func.name === name && func.userId === req.user.userId
    );
    
    if (existingFunction) {
      return res.status(400).json({ message: 'Function name already exists' });
    }

    const func = {
      id: uuidv4(),
      name,
      code,
      runtime,
      description,
      userId: req.user.userId,
      status: 'active',
      url: `https://${name}.functions.vercel-clone.com`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      invocations: 0
    };

    functions.push(func);

    // Create function file
    const functionDir = path.join(__dirname, '../../functions', func.id);
    await fs.mkdir(functionDir, { recursive: true });
    
    const functionFile = path.join(functionDir, 'index.js');
    await fs.writeFile(functionFile, code);

    res.status(201).json(func);
  } catch (error) {
    console.error('Function creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get function by ID
router.get('/:id', verifyToken, (req, res) => {
  const func = functions.find(
    f => f.id === req.params.id && f.userId === req.user.userId
  );

  if (!func) {
    return res.status(404).json({ message: 'Function not found' });
  }

  res.json(func);
});

// Update function
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const funcIndex = functions.findIndex(
      f => f.id === req.params.id && f.userId === req.user.userId
    );

    if (funcIndex === -1) {
      return res.status(404).json({ message: 'Function not found' });
    }

    const { name, code, runtime, description } = req.body;
    
    if (name) functions[funcIndex].name = name;
    if (code) functions[funcIndex].code = code;
    if (runtime) functions[funcIndex].runtime = runtime;
    if (description !== undefined) functions[funcIndex].description = description;
    
    functions[funcIndex].lastModified = new Date().toISOString();

    // Update function file
    const functionDir = path.join(__dirname, '../../functions', functions[funcIndex].id);
    const functionFile = path.join(functionDir, 'index.js');
    await fs.writeFile(functionFile, functions[funcIndex].code);

    res.json(functions[funcIndex]);
  } catch (error) {
    console.error('Function update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete function
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const funcIndex = functions.findIndex(
      f => f.id === req.params.id && f.userId === req.user.userId
    );

    if (funcIndex === -1) {
      return res.status(404).json({ message: 'Function not found' });
    }

    // Remove function file
    const functionDir = path.join(__dirname, '../../functions', functions[funcIndex].id);
    try {
      await fs.rmdir(functionDir, { recursive: true });
    } catch (error) {
      console.error('Error removing function directory:', error);
    }

    functions.splice(funcIndex, 1);
    res.json({ message: 'Function deleted successfully' });
  } catch (error) {
    console.error('Function deletion error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Invoke function
router.post('/:id/invoke', async (req, res) => {
  try {
    const func = functions.find(f => f.id === req.params.id);

    if (!func) {
      return res.status(404).json({ message: 'Function not found' });
    }

    // Increment invocation count
    func.invocations++;

    // Create execution context
    const context = {
      console: console,
      Buffer: Buffer,
      setTimeout: setTimeout,
      setInterval: setInterval,
      clearTimeout: clearTimeout,
      clearInterval: clearInterval,
      process: {
        env: process.env,
        version: process.version,
        platform: process.platform
      },
      require: require,
      module: { exports: {} },
      exports: {},
      __dirname: path.join(__dirname, '../../functions', func.id),
      __filename: path.join(__dirname, '../../functions', func.id, 'index.js')
    };

    // Create a mock request/response object
    const mockReq = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params
    };

    const mockRes = {
      status: (code) => ({ json: (data) => res.status(code).json(data) }),
      json: (data) => res.json(data),
      send: (data) => res.send(data),
      setHeader: (name, value) => res.setHeader(name, value)
    };

    // Add request/response to context
    context.req = mockReq;
    context.res = mockRes;

    // Execute function code in sandbox
    const script = new vm.Script(`
      (function() {
        ${func.code}
        
        // If the function exports a handler, call it
        if (typeof module.exports === 'function') {
          return module.exports(mockReq, mockRes);
        } else if (typeof exports === 'function') {
          return exports(mockReq, mockRes);
        } else {
          // If no handler is exported, return the code execution result
          return 'Function executed successfully';
        }
      })()
    `);

    const result = script.runInNewContext(context, {
      timeout: 5000, // 5 second timeout
      displayErrors: true
    });

    if (result !== undefined) {
      res.json({ result });
    }
  } catch (error) {
    console.error('Function execution error:', error);
    res.status(500).json({ 
      message: 'Function execution failed',
      error: error.message 
    });
  }
});

// Get function logs
router.get('/:id/logs', verifyToken, (req, res) => {
  const func = functions.find(
    f => f.id === req.params.id && f.userId === req.user.userId
  );

  if (!func) {
    return res.status(404).json({ message: 'Function not found' });
  }

  // In a real implementation, you would store logs in a database
  const logs = [
    {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `Function ${func.name} invoked`,
      invocations: func.invocations
    }
  ];

  res.json({ logs });
});

module.exports = router;