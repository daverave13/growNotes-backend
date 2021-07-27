const express = require("express");
const path = require("path");
const logger = require("./middleware/logger");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

const app = express();

// Initialize middleware
app.use(logger);
app.use(cors());

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set a static folder
// public/index.html will be served by default
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/plants", require("./routes/api/plants"));
app.use("/api/events", require("./routes/api/events"));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//listen on both http and https
// const httpsServer = https.createServer(
//     {
//         key: fs.readFileSync("/etc/letsencrypt/live/dslusser.com/privkey.pem"),
//         cert: fs.readFileSync(
//             "/etc/letsencrypt/live/dslusser.com/fullchain.pem"
//         ),
//     },
//     app
// );

// httpsServer.listen(5001, "0.0.0.0");
