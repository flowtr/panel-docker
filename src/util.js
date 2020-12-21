const serve = require("serve-handler");
const path = require("upath");

exports.sendNotFound = (req, res) => res.send("<h1>Nothing to see here.</h1>");
// Serve static assets
exports.assets = async (req, res) =>
    await serve(req, res, {
        cleanUrls: true,
        public: path.join(__dirname, "..", "public"),
        rewrites: [{ source: "panel/**", destination: "/index.html" }],
    });
