const ExcelJS = require('exceljs');
const Income = require("../models/Income");

// Add Income
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    // Validation: Check for missing fields
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = new Income({ 
      userId, 
      icon, 
      source, 
      amount, 
      date: new Date(date)
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Income (For Logged-in User)
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Income
exports.deleteIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Income Details in Excel
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Income');

    // Define columns
    worksheet.columns = [
      { header: 'Source', key: 'source', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Date', key: 'date', width: 15 }
    ];

    // Add data rows
    income.forEach((item) => {
      worksheet.addRow({
        source: item.source,
        amount: item.amount,
        date: item.date
      });
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=income_details.xlsx');

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
