import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
    #database = {};

    constructor() {
        fs.readFile(databasePath, "utf-8").then(data => {
            this.#database = JSON.parse(data);
        })
        .catch(() => {
            this.#persist();
        })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    }

    select(table) {
        const data = this.#database[table];

        return data;
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data);
        } else {
            this.#database[table] = [data];
        }

        this.#persist();

        return data;
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id);

        if (rowIndex > -1) {
            const currentData = this.#database[table][rowIndex];

            Object.assign(currentData, data);

            this.#persist();
        }
    }

    complete(table, id) {

        const rowIndex = this.#database[table].findIndex(row => row.id === id);

        const day = new Date().getDate();
        const month = (new Date().getMonth()) + 1;
        const year = new Date().getFullYear();

        const date = `${day}/${month}/${year}`;

        if (rowIndex > -1) {
            if (this.#database[table][rowIndex].completed_at === null) {
                this.#database[table][rowIndex].completed_at = date;
                this.#persist();
            }
        }
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id);

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1);
            this.#persist();
        }
    }
}