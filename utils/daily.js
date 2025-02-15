const axios = require('axios');

const DAILY_API_KEY = '8a01cf14f766fbe1cebb51e4d8c8fee7b38c8d590abc14bb9c93fe991898ca50'; // 🔴 Replace with actual API key

async function createDailyRoom() {
    try {
        const response = await axios.post(
            'https://api.daily.co/v1/rooms',
            {
                name: `room-${Date.now()}`,
                properties: { exp: Math.floor(Date.now() / 1000) + 3600 } // 1 hour expiry
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DAILY_API_KEY}`
                }
            }
        );

        return { roomUrl: response.data.url };
    } catch (error) {
        console.error('Error creating Daily room:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { createDailyRoom };
