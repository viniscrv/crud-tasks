import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import { getCurrentDate } from "./utils/get-current-date.js";

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

            const { title, description } = req.body;

            const date = getCurrentDate();

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: date,
            }

            if (title && description) {
                database.insert("tasks", task);

                return res.writeHead(201).end();
            }

            return res.writeHead(400).end();
        },
    },
    {
        method: "PUT",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {

            const { id } = req.params;
            const data = req.body;

            const date = getCurrentDate();

            database.update("tasks", id, {
                ...data,
                updated_at: date
            });

            return res.writeHead(200).end();
        },
    },
    {
        method: "PATCH",
        path: buildRoutePath("/tasks/:id/complete"),
        handler: (req, res) => {

            const { id } = req.params;

            database.complete("tasks", id);

            return res.writeHead(200).end();
        },
    },
    {
        method: "DELETE",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {

            const { id } = req.params;

            database.delete("tasks", id);

            return res.writeHead(204).end();
        },
    },
]