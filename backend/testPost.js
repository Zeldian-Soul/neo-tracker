// backend/testPost.js

const sendTestComment = async () => {
    try {
        console.log("🚀 Sending a test comment to the server...");

        const response = await fetch('http://localhost:5000/api/neo/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // This is the data payload we are sending to your Express controller
            body: JSON.stringify({
                asteroidId: "2023NT1",
                username: "SpaceExplorer",
                text: "Testing the Atlas connection. The trajectory looks clear!"
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ SUCCESS! Comment saved to MongoDB:");
            console.log(data);
        } else {
            console.error("❌ FAILED TO SAVE:");
            console.error(data);
        }

    } catch (error) {
        console.error("❌ NETWORK ERROR:");
        console.error(error.message);
    }
};

sendTestComment();