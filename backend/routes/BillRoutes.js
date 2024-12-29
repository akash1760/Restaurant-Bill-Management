const express = require('express');
const router = express.Router();
// const Report = require('./models/Report');
const Bill = require('../models/Bill');  // Ensure you're importing the Bill model
// const Report = require('../models/Report'); 
router.post('/add', async (req, res) => {
    const { amount } = req.body;

    try {
        const bill = new Bill({ amount, date: new Date() }); // Save the current date and time
        await bill.save();
        res.status(201).json({ message: 'Bill added successfully', bill });
    } catch (error) {
        console.error('Error adding bill:', error);
        res.status(400).json({ message: 'Error adding bill', error });
    }
});


// Get daily earnings
router.get('/daily', async (req, res) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today

    try {
        // Fetch bills created within today's range
        const bills = await Bill.find({ date: { $gte: startOfDay, $lte: endOfDay } });
        console.log("Bills fetched:", bills); // Debug log
        const total = bills.reduce((acc, bill) => acc + bill.amount, 0);
        res.json({ total, bills });
    } catch (error) {
        console.error('Error fetching daily data:', error);
        res.status(400).json({ message: 'Error fetching daily data', error });
    }
});


// Fetch all reports
// router.get('/reports', async (req, res) => {
//     try {
//         const reports = await Bill.find({});  // Fetch all bills from the database
//         if (reports.length === 0) {
//             return res.status(404).json({ message: 'No reports found' });
//         }
//         res.json(reports);  // Send the fetched reports (bills) as JSON
//     } catch (error) {
//         console.error("Error fetching reports:", error);
//         res.status(500).json({ message: "Failed to fetch reports", error });
//     }
// });

// Get daily reports
router.get('/reports', async (req, res) => {
    try {
        // Aggregation to group bills by date
        const reports = await Bill.aggregate([
            {
                $addFields: {
                    // Convert 'date' field to Date if it is not in Date format
                    date: { $toDate: "$date" } // Convert the date to Date format
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // Group by date in YYYY-MM-DD format
                    total: { $sum: "$amount" } // Sum of all amounts on that day
                }
            },
            { $sort: { _id: -1 } } // Sort by date in descending order
        ]);

        if (reports.length === 0) {
            return res.status(404).json({ message: 'No reports found' });
        }

        res.json(reports); // Send the grouped reports
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Failed to fetch reports', error });
    }
});

// Fetch bills of a specific day
// router.get('/reports/:date', async (req, res) => {
//     try {
//         const { date } = req.params;
//         const report = await Report.findOne({ date: new Date(date) }).populate('bills');
//         if (!report) return res.status(404).json({ message: 'Report not found' });
//         res.json(report);
//     } catch (error) {
//         console.error('Error fetching report:', error);
//         res.status(500).json({ message: 'Failed to fetch report' });
//     }
// });

module.exports = router;



