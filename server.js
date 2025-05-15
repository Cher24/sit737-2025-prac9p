import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware สำหรับแปลง body ของ POST/PUT เป็น JSON
app.use(express.json());

// MongoDB connection
const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/calculatorDB";

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Schema & Model
const calcSchema = new mongoose.Schema({
    operation: String,
    a: Number,
    b: Number,
    result: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
const Calculation = mongoose.model("Calculation", calcSchema);

// Log calculation
async function logCalculation(operation, a, b, result) {
    try {
        await Calculation.create({ operation, a, b, result });
    } catch (err) {
        console.error("Logging error:", err.message);
    }
}

// CRUD: CREATE (จาก calculator routes)
app.get("/add", async (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    const result = a + b;
    await logCalculation("add", a, b, result);
    res.json({ result });
});

app.get("/subtract", async (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    const result = a - b;
    await logCalculation("subtract", a, b, result);
    res.json({ result });
});

app.get("/multiply", async (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    const result = a * b;
    await logCalculation("multiply", a, b, result);
    res.json({ result });
});

app.get("/divide", async (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    if (b === 0) {
        return res.status(400).json({ error: "Division by zero" });
    }
    const result = a / b;
    await logCalculation("divide", a, b, result);
    res.json({ result });
});

// CRUD: CREATE (Manual store)
app.get("/storeResult", async (req, res) => {
    const { operation, a, b, result } = req.query;
    if (!operation || isNaN(a) || isNaN(b) || isNaN(result)) {
        return res.status(400).json({ error: "Invalid query parameters" });
    }
    try {
        const record = new Calculation({
            operation,
            a: parseFloat(a),
            b: parseFloat(b),
            result: parseFloat(result)
        });
        await record.save();
        res.send("Stored!");
    } catch (err) {
        res.status(500).json({ error: "Failed to store result" });
    }
});

// CRUD: READ
app.get("/results", async (req, res) => {
    try {
        const results = await Calculation.find().sort({ createdAt: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch results" });
    }
});

// CRUD: UPDATE
app.put("/updateResult/:id", async (req, res) => {
    const { id } = req.params;
    const { operation, a, b, result } = req.body;
    try {
        const updated = await Calculation.findByIdAndUpdate(
            id,
            { operation, a, b, result },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.json({ message: "Result updated", updated });
    } catch (err) {
        res.status(500).json({ error: "Failed to update result" });
    }
});

// CRUD: DELETE
app.delete("/deleteResult/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Calculation.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.json({ message: "Result deleted", deleted });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete result" });
    }
});

import path from "path";
import { fileURLToPath } from "url";

// ES Modules fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend static files
app.use(express.static(path.join(__dirname, "public")));


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});