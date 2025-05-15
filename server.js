import express from "express"; // Import Express framework
import mongoose from "mongoose"; // Import Mongoose for MongoDB interaction

const app = express(); // Initialize Express app
const PORT = process.env.PORT || 3001; // Set the port from environment or default to 3001

// Middleware to parse JSON body from POST/PUT requests
app.use(express.json());

// MongoDB connection
const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/calculatorDB"; // Use env URL or fallback to local DB

mongoose.connect(mongoURL, {
    useNewUrlParser: true,        // Use new URL parser to avoid deprecation warnings
    useUnifiedTopology: true,     // Use unified topology engine
})
.then(() => console.log("MongoDB connected")) // Log success message
.catch((err) => console.error("MongoDB connection error:", err)); // Log connection error

// Schema & Model
const calcSchema = new mongoose.Schema({ // Define schema for calculator operations
    operation: String,  // Type of operation (e.g., add, subtract)
    a: Number,          // First operand
    b: Number,          // Second operand
    result: Number,     // Result of the operation
    createdAt: {
        type: Date,         // Timestamp of the operation
        default: Date.now,  // Default to current date/time
    }
});
const Calculation = mongoose.model("Calculation", calcSchema); // Create Mongoose model from schema

// Log calculation
async function logCalculation(operation, a, b, result) {
    try {
        // Save the calculation to MongoDB
        await Calculation.create({ operation, a, b, result });
    } catch (err) {
        console.error("Logging error:", err.message); // Log error if save fails
    }
}

// CRUD: CREATE (from calculator routes)
app.get("/add", async (req, res) => {
    // Parse input numbers from query
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    const result = a + b; // Perform addition
    await logCalculation("add", a, b, result); // Log to DB
    res.json({ result }); // Send result as JSON
});

app.get("/subtract", async (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    const result = a - b; // Perform subtraction
    await logCalculation("subtract", a, b, result);
    res.json({ result });
});

app.get("/multiply", async (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    const result = a * b; // Perform multiplication
    await logCalculation("multiply", a, b, result);
    res.json({ result });
});

app.get("/divide", async (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    if (b === 0) {
        // Handle division by zero
        return res.status(400).json({ error: "Division by zero" });
    }
    const result = a / b; // Perform division
    await logCalculation("divide", a, b, result);
    res.json({ result });
});

// CRUD: CREATE (Manual store from query params)
app.get("/storeResult", async (req, res) => {
    const { operation, a, b, result } = req.query;
    if (!operation || isNaN(a) || isNaN(b) || isNaN(result)) {
        // Validate input
        return res.status(400).json({ error: "Invalid query parameters" });
    }
    try {
        // Create a new record manually
        const record = new Calculation({
            operation,
            a: parseFloat(a),
            b: parseFloat(b),
            result: parseFloat(result)
        });
        await record.save(); // Save to DB
        res.send("Stored!");
    } catch (err) {
        res.status(500).json({ error: "Failed to store result" });
    }
});

// CRUD: READ
app.get("/results", async (req, res) => {
    try {
        // Fetch all calculations sorted by creation date (latest first)
        const results = await Calculation.find().sort({ createdAt: -1 });
        res.json(results); // Return as JSON
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch results" });
    }
});

// CRUD: UPDATE
app.put("/updateResult/:id", async (req, res) => {
    const { id } = req.params;
    const { operation, a, b, result } = req.body;
    try {
        // Find the record by ID and update it
        const updated = await Calculation.findByIdAndUpdate(
            id,
            { operation, a, b, result },
            { new: true } // Return updated document
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
        // Delete record by ID
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

// ES Modules fix: create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Start the server on specified port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
