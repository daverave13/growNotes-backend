const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const growNotesSchema = require("../../public/connections/growNotesSchema");

const connection = mysql.createConnection(growNotesSchema);

const convertStatusToInt = (strStatus) => {
    if (Number(strStatus) < 4 && Number(strStatus) >= 0)
        return Number(strStatus);
    switch ((strStatus + "").toLowerCase()) {
        case "seed":
            return 0;
        case "planted":
            return 1;
        case "bloomed":
            return 2;
        case "harvested":
            return 3;
        default:
            return 0;
    }
};

// Get all plants
router.get("/", (req, res) => {
    const sql = `SELECT * FROM plants;`;
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
        res.status(200);
    });
});

// Get a single plant
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM plants WHERE id = ${id}`;
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Create a plant
router.post("/", (req, res) => {
    const { name } = req.body;
    const status = convertStatusToInt(req.body.status);

    if (!name) {
        res.status(400).json({
            err: "Missing plant name",
        });
    } else {
        const sql = `INSERT INTO plants (id, name, status) VALUES (default, '${name}', ${status});`;
        connection.query(sql, (err, results) => {
            if (err) throw err;
            res.send(results);
        });
    }
});

// Update a plant
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const status = convertStatusToInt(req.body.status);

    let sql = `UPDATE plants SET name = '${name}', status = ${status} WHERE id = '${id}';`;

    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Delete a plant
router.delete("/:id", (req, res) => {
    const sql = `DELETE FROM plants WHERE id = '${req.params.id}';`;
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

module.exports = router;
