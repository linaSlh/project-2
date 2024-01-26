// const express = require('express');
// const router = express.Router();
// const Session = require("../models/session.model");
// const mongoose = require('mongoose');

// // Create sessions manually
// const createSessionsManually = async () => {
//     try {
//         // Create session objects
//         const session1 = new Session({
//             owner: '65b274243555176ba51607ee',
//             theme: 'family',
//             isAvailable: true,
//             client: null
//         });

//         const session2 = new Session({
//             owner: 'user2_id',
//             theme: 'wedding',
//             isAvailable: true,
//             client: null
//         });

//         // Save sessions to the database
//         await session1.save();
//         await session2.save();
//         console.log('Sessions created successfully');
//     } catch (error) {
//         console.error('Error creating sessions:', error);
//     }
// };

// // Route to display all events
// router.get('/all-events', async (req, res) => {
//     try {
//         // Retrieve all sessions from the database
//         const sessions = await Session.find({});
//         res.render('all-events', { sessions });
//     } catch (error) {
//         console.error('Error fetching sessions:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// // Call function to create sessions manually (you can call this function where appropriate)
// createSessionsManually();

// module.exports = router;
