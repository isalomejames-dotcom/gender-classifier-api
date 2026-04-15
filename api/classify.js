const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        const nameParam = req.query.name;

        // === FIX 1: Strict Query Parameter & Error Handling (400/422) ===
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
        const response = await axios.get(apiUrl);

        const data = response.data;

        // Genderize edge case
        if (data.gender === null || data.count === 0) {
            return res.status(200).json({
                status: "error",
                message: "No prediction available for the provided name"
            });
        }

        // === FIX 2 & 3: Proper Processing + Confidence Logic ===
        const processedData = {
            name: data.name,
            gender: data.gender,
            probability: data.probability,
            sample_size: data.count,                    // renamed correctly
            is_confident: data.probability >= 0.7 && data.count >= 100,   // exact rule
            processed_at: new Date().toISOString()      // proper UTC ISO 8601
        };

        // === FIX 4: Exact Success Response Structure ===
        return res.status(200).json({
            status: "success",
            data: processedData
        });

    } catch (error) {
        console.error('Error:', error.message);
        return res.status(502).json({
            status: "error",
            message: "Failed to fetch data from Genderize API"
        });
    }
};