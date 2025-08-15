import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "../../axiosInstance";
import { Search } from "lucide-react";
import { FaTicketSimple } from "react-icons/fa6";

export default function AdminTicketsView() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/users-tickets");
      setTickets(res.data || []);
      setFilteredTickets(res.data || []);
    } catch (err) {
      console.log(err)
      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Search filtering
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = tickets.filter(
      (ticket) =>
        ticket.username?.toLowerCase().includes(lower) ||
        ticket.email?.toLowerCase().includes(lower) ||
        ticket.subject?.toLowerCase().includes(lower) ||
        ticket.status?.toLowerCase().includes(lower)
    );
    setFilteredTickets(filtered);
  }, [searchTerm, tickets]);

  // Close ticket handler
  const handleCloseTicket = async (ticketId) => {
    try {
      await axios.put(`/admin/close-ticket/${ticketId}`);
      toast.success("Ticket closed successfully");

      // Update local state immediately
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId ? { ...t, status: "CLOSED" } : t
        )
      );

      // Also update selected ticket state
      setSelectedTicket((prev) =>
        prev ? { ...prev, status: "CLOSED" } : prev
      );

      fetchTickets();
    } catch (err) {
      console.log(err)
      toast.error("Failed to close ticket");
    }
  };

  return (
    <div className="p-4 sm:p-6 dark:bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-2xl font-bold mb-6 text-main dark:text-gray-200 px-3 uppercase flex gap-3 items-center">
          <FaTicketSimple className="text-4xl"/>User Tickets
        </h1>

        {/* Search Bar */}
        <div className=" relative mb-6">
          <input
            type="text"
            placeholder="Search by user, email, subject, or status..."
            className="w-full px-4 py-2 pl-10 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-main "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        {/* Tickets Table */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          {loading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Loading tickets...
            </div>
          ) : filteredTickets.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {ticket.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {ticket.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                      {ticket.subject}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.status === "CLOSED"
                            ? "bg-green-100 text-green-800"
                            : ticket.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="text-main hover:text-green-900 cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No tickets found.
            </div>
          )}
        </div>
      </motion.div>

      {/* View Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 flex items-center justify-center bg-main bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4 text-main uppercase dark:text-gray-200">
              Ticket Details
            </h2>
            <p><strong>User:</strong> {selectedTicket.username}</p>
            <p><strong>Email:</strong> {selectedTicket.email}</p>
            <p><strong>Subject:</strong> {selectedTicket.subject}</p>
            <p><strong>Status:</strong> {selectedTicket.status}</p>
            <p><strong>Created At:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}</p>

            <div className="mt-6 flex justify-end gap-3">
              {selectedTicket.status !== "CLOSED" && (
                <button
                  onClick={() => handleCloseTicket(selectedTicket.id)}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                >
                  Close Ticket
                </button>
              )}
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200 cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
