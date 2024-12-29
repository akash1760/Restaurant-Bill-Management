// const express = require('express');
// const connectDB = require('./config/db');
// const billRoutes = require('./routes/BillRoutes');
// const bodyParser = require('body-parser');
// require('dotenv').config();

// const app = express();

// // Connect to database
// connectDB();

// // Middleware
// app.use(bodyParser.json());

// // Routes
// app.use('/api/bills', billRoutes);

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// --------------------SECOND-------------------



const express = require('express');
const connectDB = require('./config/db');
const billRoutes = require('./routes/BillRoutes');
const bodyParser = require('body-parser');
const nodeSchedule = require('node-schedule'); // Import node-schedule
require('dotenv').config();


// const cors = require('cors');
const app = express();
connectDB();

// app.use(cors());
app.use(bodyParser.json());
app.use('/api/bills', billRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Reset daily totals at midnight
const resetDailyTotal = async () => {
    try {
        const Bill = require('./models/Bill'); // Adjust path to your Bill model
        const bills = await Bill.find({});

        if (bills.length > 0) {
            const Report = require('./models/Reports'); // Adjust path to your Report model

            // Save daily data to the reports collection
            await Report.create({
                date: new Date(),
                total: bills.reduce((sum, bill) => sum + bill.amount, 0),
                bills,
            });

            // Clear bills for the next day
            await Bill.deleteMany({});
            console.log('Daily totals reset and report saved.');
        }
    } catch (error) {
        console.error('Error resetting daily totals:', error);
    }
};

// Schedule the reset at midnight
nodeSchedule.scheduleJob('0 0 * * *', resetDailyTotal);
