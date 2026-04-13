const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS (required by the grading script)
app.use(cors({ origin: '*' }));

// GET /api/classify?name=...
app.get('/api/classify', async (req, res) => {
    try {
        const nameParam = req.query.name;

        // Input validation - exactly as per task
        if (nameParam === undefined || nameParam === null) {
            return res.status(400).json({
                status: "error",
                message: "Name parameter is required"
            });
        }

        if (typeof nameParam !== 'string') {
            return res.status(422).json({
                status: "error",
                message: "Name must be a string"
            });
        }

        const name = nameParam.trim();

        if (name === '') {
            return res.status(400).json({
                status: "error",
                message: "Name parameter cannot be empty"
            });
        }

        // Call Genderize API
        const apiUrl = `https://api.genderize.io?name=${encodeURIComponent(name)}`;
        const response = await axios.get(apiUrl, { timeout: 3000 });
        const data = response.data;

        // Genderize edge case
        if (data.gender === null || data.count === 0) {
            return res.status(200).json({
                status: "error",
                message: "No prediction available for the provided name"
            });
        }

        // Process the data exactly as required
        const processedData = {
            name: data.name,
            gender: data.gender,
            probability: data.probability,
            sample_size: data.count,                    // renamed
            is_confident: data.probability >= 0.7 && data.count >= 100,
            processed_at: new Date().toISOString()      // UTC ISO 8601
        };

        // Success response
        return res.status(200).json({
            status: "success",
            data: processedData
        });

    } catch (error) {
        console.error('Error:', error.message);

        if (error.response) {
            // Upstream API issue
            return res.status(502).json({
                status: "error",
                message: "Failed to fetch data from Genderize API"
            });
        }

        // Any other server error
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ Test it: http://localhost:${PORT}/api/classify?name=Sally`);
});