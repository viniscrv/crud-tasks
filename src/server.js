import http from "node:http";
import { routes } from "./routes.js";

const server = http.createServer((req, res) => {

    const { method } = req;
    
    const route = routes.find(route => {
        return route.method === method;
    });

    if (route) {
        return route.handler(req, res);
    }

    return res.writeHead(200).end();
});

server.listen(3333);