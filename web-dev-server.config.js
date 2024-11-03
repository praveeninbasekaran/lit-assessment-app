/* web-dev-server.config.js
export default {
    rootDir: './dist', // Ensure this points to the output directory
    open: '/index.html',
    watch: true,
    nodeResolve: true, // Enable module resolution
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
};
*/
// web-dev-server.config.js
export default {
    rootDir: './dist', // Change this to '.' to serve from the root directory
    open: '/index.html', // Ensure this opens the index.html file in the root
    watch: true,
    nodeResolve: true, // Enable module resolution
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/javascript', // Add this line if necessary
    }
};
