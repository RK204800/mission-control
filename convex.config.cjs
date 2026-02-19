const convex = require("convex");
const path = require("path");

module.exports = {
  // Specify the path to your Convex functions
  functions: path.join(__dirname, "convex/functions"),
  
  // Generate TypeScript types
  generateCommonJSApi: true,
  
  // Vercel deployment
  vercel: {
    // Vercel project settings
  }
};