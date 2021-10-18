// This global variable is required to prevent "ReferenceError: process is not defined".
// The global vairable is expected by Redux.
window.process = { env: { NODE_ENV: 'developmen' } };
// console.log(`## test/global-variables.js set: process=${JSON.stringify(process)}`);

window.backendUrlPrefix = 'http://fakehost:8123/api';
