import express from "express";
import http from "http";
import path from "path";
import fs from "fs";
import socketIo from "socket.io";

import {isDevelopment} from "./settings";
import {CardDatabase} from "./model/cards";
import {Client} from "./model/client";
import {Application} from "./model/application";

//-----------------------
// Setup
const app = express();
const server = new http.Server(app);
const io = socketIo(server);

//-----------------------
// Configuration
app.set("view engine", "pug");
app.use(express.static("public"));

const useExternalStyles = !isDevelopment;
const scriptRoot = isDevelopment
    ? "http://localhost:8080/build"
    : "/build";

app.get("*", (req, res) => {
    res.render("index", {
        useExternalStyles,
        scriptRoot
    });
});

//-----------------------
// Services
const cards = new CardDatabase();
const setsPath = path.join(global.appRoot, "data", "sets");
for (let file of fs.readdirSync(setsPath)) {
    const setId = path.parse(file).name;
    const setPath = path.join(setsPath, file);
    cards.addSet(setId, JSON.parse(fs.readFileSync(setPath, "utf-8")));
}

const cardsApp = new Application(cards);

//-----------------------
// Startup
io.on("connection", socket => new Client(socket, cardsApp));

//-----------------------
// Startup
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Started http server on ${port}`);
});