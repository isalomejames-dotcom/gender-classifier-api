const axios = require('axios');

module.exports = async (req, res) => {
    // Required CORS header
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        const nameParam = req.query.name;

        // Input validation
        if (!nameParam || typeof nameParam !== 'string' || nameParam.trim() === '') {
            return res.status(400).json({
                status: "error",
                message: "Name parameter is required and must be a non-empty string"
            });
        }

        const name = nameParam.trim();

        // Call Genderize API
        const apiUrl = `https://api.genderize.io?name=${encodeURIComponent(name)}`;
        const response = await axios.get(apiUrl);

        const data = response.data;

        // Edge case from Genderize
        if (data.gender === null || data.count === 0) {
            return res.status(200).json({
                status: "error",
                message: "No prediction available for the provided name"
            });
        }

        // Process the data as per requirements
        const processedData = {
            name: data.name,
            gender: data.gender,
            probability: data.probability,
            sample_size: data.count,                    // renamed
            is_confident: data.probability >= 0.7 && data.count >= 100,
            processed_at: new Date().toISOString()
        };

        // Success response
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
