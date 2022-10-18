# Jest Resolver Enhanced

Allows Jest to handle [conditional exports](https://nodejs.org/api/packages.html#packages_conditional_exports).
Uses `node` and `require` exports.

Under the hood:
- use [enhanced-resolve](https://www.npmjs.com/package/enhanced-resolve) from Webpack by default,
- if enhanced-resolve fails, use vanilla Jest resolver.
