import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {

            const tasks = database.select("tasks");

            return res.end(JSON.stringify(tasks));
        },
    },
    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {

            const { title, description, created_at } = req.body;

            const task = {
                id: randomUUID(),
                title,
                description,
                // completed_at,
                created_at,
                // updated_at,
            }

            database.insert("tasks", task);

            return res.writeHead(201).end();
        },
    },
]