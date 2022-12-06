const http = require("node:http");
const { setTimeout: wait } = require("node:timers/promises");

const server = http.createServer(async (req, res) => {
    await wait(1000);

    res.writeHead(302, {
        "Location": "http://localhost:3000/sign-in/provider/callback"
    });
    res.end();
});

server.listen(3001);
console.log("do something")