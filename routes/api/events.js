const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const growNotesSchema = require("../../public/connections/growNotesSchema");

const connection = mysql.createConnection(growNotesSchema);

// Get all events
router.get("/", (req, res) => {
    const sql = `SELECT * FROM events;`;
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
        res.status(200);
    });
});

// Get a single event
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM events WHERE id = ${id}`;
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Create a event
router.post("/", (req, res) => {
    const { plant_id, type, note } = req.body;
    if (Number(plant_id) < 0 || typeof plant_id !== "number") {
        console.log(typeof plant_id);
        res.status(400).json({
            err: "plant_id must be a positive integer",
        });
    } else if (!plant_id || !type || !note) {
        res.status(400).json({
            err: "plant_id, note and type are required",
        });
    } else {
        const sql = `insert into events (id, plant_id, type, note) VALUES (default, ${plant_id}, '${type.toLowerCase()}', '${note}');`;
        connection.query(sql, (err, results) => {
            if (err) throw err;
            res.send(results);
        });
    }
});

// Update a event
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const body = req.body;

    let sql = `UPDATE events SET `;

    for (key in body) if (body[key]) sql += `${key} = '${body[key]}', `;
    sql = sql.slice(0, sql.length - 2);
    sql += `WHERE id = '${id}';`;

    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Delete a event
router.delete("/:id", (req, res) => {
    const sql = `DELETE FROM events WHERE id = '${req.params.id}';`;
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

module.exports = router;
