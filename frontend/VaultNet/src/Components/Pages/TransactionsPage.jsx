import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../../axiosInstance";
import { AuthContext } from "../Context/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaDownload } from "react-icons/fa";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.id) {
      fetchTransactions();
    }
  }, [filter, user]);

  useEffect(() => {
    applyDateFilter();
  }, [dateRange, allTransactions]);

  const fetchTransactions = async () => {
    try {
      const userId = user.id;
      let url = `/customer/user/${userId}/transactions`;

      if (filter === "DEBIT") url = `/customer/user/${userId}/debit`;
      if (filter === "CREDIT") url = `/customer/user/${userId}/credit`;

      const res = await axiosInstance.get(url);

      const fetchedData = Array.isArray(res.data) ? res.data : [];
      setAllTransactions(fetchedData);
      setTransactions(fetchedData);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const applyDateFilter = () => {
    if (!dateRange.start && !dateRange.end) {
      setTransactions(allTransactions);
      return;
    }

    const start = dateRange.start ? new Date(dateRange.start + "T00:00:00") : null;
    const end = dateRange.end ? new Date(dateRange.end + "T23:59:59") : null;

    const filtered = allTransactions.filter((tx) => {
      const txDate = new Date(tx.timestamp);
      if (start && txDate < start) return false;
      if (end && txDate > end) return false;
      return true;
    });

    setTransactions(filtered);
  };

  const formatAmount = (type, amount) => {
    const sign = type === "CREDIT" ? "+" : "-";
    return `${sign}₹${amount}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const exportPDF = () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("VaultNet - Transaction Statement", 14, 15);

  // Date range in header
  doc.setFontSize(11);
  doc.setTextColor(100);
  const startDate = dateRange.start ? new Date(dateRange.start).toLocaleDateString() : "All";
  const endDate = dateRange.end ? new Date(dateRange.end).toLocaleDateString() : "All";
  doc.text(`Date Range: ${startDate} - ${endDate}`, 14, 25);

  // Calculate totals
  let totalCredit = 0;
  let totalDebit = 0;
  transactions.forEach((tx) => {
    if (tx.type === "CREDIT") totalCredit += Number(tx.amount);
    if (tx.type === "DEBIT") totalDebit += Number(tx.amount);
  });

  // Table
  autoTable(doc, {
    startY: 35,
    head: [["Date", "Time", "Transaction ID", "Type", "Amount", "Description"]],
    body: transactions.map((tx) => [
      formatDate(tx.timestamp),
      formatTime(tx.timestamp),
      tx.id,
      tx.type,
      `${tx.type === "CREDIT" ? "+" : "-"} INR ${tx.amount}`,
      tx.description || ""
    ]),
    styles: { fontSize: 10, cellPadding: 3, lineColor: [200, 200, 200], lineWidth: 0.1 },
    headStyles: { fillColor: [66, 139, 202], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    theme: "grid",
  });

  // Summary row
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 5,
    head: [["Total Credit", "Total Debit"]],
    body: [[ `+INR ${totalCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
  `-INR ${totalDebit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` ]],
    styles: { fontSize: 11, halign: "center" },
    headStyles: { fillColor: [40, 167, 69], textColor: 255 },
    theme: "grid"
  });

  // Footer with page number
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: "center" });
  }

  // Save
  doc.save("transactions.pdf");
};

  return (
    <div className="flex-1 bg-gray-50">

    <h1 className="text-xl uppercase py-5 bg-main font-semibold text-white px-5 md:px-20">VaultNet Bank - Transactions Statement</h1>
    <div className="px-5 md:px-20 py-20 pt-10">
      {/* Filters */}
      <div className="bg-sec p-8 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div className="flex flex-col md:flex-row jus md:justify-between md:gap-10">
            <div className="flex flex-col">
          <label className="text-sm font-semibold text-main uppercase mb-1 px-1">Start Date</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className=" border-1 border-gray-300 bg-white uppercase p-2 text-xs focus:ring-1 focus:ring-main focus:border-main focus:outline-none outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-main uppercase mb-1 px-1">End Date</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="border-gray-300 uppercase border-1 bg-white p-2 focus:ring-1 text-xs focus:ring-main focus:border-main focus:outline-none outline-none"
          />
        </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-main mb-1 uppercase">Transaction Type</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="uppercase border-1 border-gray-300 p-2 focus:ring-1 text-xs bg-white text-main focus:ring-main focus:border-main focus:outline-none outline-none"
          >
            <option value="ALL">All</option>
            <option value="DEBIT">Debit</option>
            <option value="CREDIT">Credit</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-sec shadow-sm overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-main text-white sticky top-0 z-10">
            <tr className="divide-x divide-gray-400">
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Transaction ID</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-400">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.id} className="divide-x divide-gray-400">
                  <td className="p-3">{formatDate(tx.timestamp)}</td>
                  <td className="p-3">{formatTime(tx.timestamp)}</td>
                  <td className="p-3">{tx.id}</td>
                  <td className="p-3">{tx.type}</td>
                  <td className="p-3">{formatAmount(tx.type, tx.amount)}</td>
                  <td className="p-3">{tx.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-400">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
      <div className="flex justify-end p-5 pr-0">
            <button
          onClick={exportPDF}
          className="bg-main text-white px-4 py-2 hover:bg-green-900 flex gap-2"
        >
         <FaDownload className="pt-1 text-xl"/>Download Transactions
        </button>
        </div>
      </div>
    </div>
  );
}
