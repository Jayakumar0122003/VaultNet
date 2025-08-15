import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "../../axiosInstance";
import { Search } from "lucide-react";
import { ImBlocked } from "react-icons/im";


export default function AdminUnblockCard() {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  const fetchBlockedCards = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/blocked-cards");
      setCards(res.data || []);
      setFilteredCards(res.data || []);
    } catch (err) {
      console.log(err)
      toast.error("Failed to fetch blocked cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedCards();
  }, []);

  // Search filtering
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = cards.filter(
      (card) =>
        card.cardNumber?.toLowerCase().includes(lower) ||
        card.cardHolderName?.toLowerCase().includes(lower) ||
        card.cardType?.toLowerCase().includes(lower)
    );
    setFilteredCards(filtered);
  }, [searchTerm, cards]);

  // Unblock card handler
  const handleUnblockCard = async (cardNumber) => {
    try {
      await axios.post(`/admin/unblock-card?cardNumber=${encodeURIComponent(cardNumber)}`);
      toast.success("Card unblocked successfully");
      setSelectedCard(null);
      fetchBlockedCards();
    } catch (err) {
      console.log(err)
      toast.error("Failed to unblock card");
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
          <ImBlocked className="text-4xl"/>Blocked Cards
        </h1>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by card number, holder name, or type..."
            className="w-full px-4 py-2 pl-10 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-main"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        {/* Cards Table */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          {loading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Loading blocked cards...
            </div>
          ) : filteredCards.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Card Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Holder Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Card Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCards.map((card) => (
                  <tr
                    key={card.cardNumber}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      **** **** **** {card.cardNumber?.slice(-4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {card.cardHolderName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                      Savings
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {card.expiryDate}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => setSelectedCard(card)}
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
              No blocked cards found.
            </div>
          )}
        </div>
      </motion.div>

      {/* View Modal */}
      {selectedCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-main bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4 text-main uppercase dark:text-gray-200">
              Card Details
            </h2>
            <p><strong>Card Number:</strong> **** **** **** {selectedCard.cardNumber?.slice(-4)}</p>
            <p><strong>Holder Name:</strong> {selectedCard.cardHolderName}</p>
            <p><strong>Card Type:</strong> {selectedCard.cardType}</p>
            <p><strong>Expiry Date:</strong> {selectedCard.expiryDate}</p>
            <p><strong>Status:</strong> Blocked</p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => handleUnblockCard(selectedCard.cardNumber)}
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 cursor-pointer"
              >
                Unblock Card
              </button>
              <button
                onClick={() => setSelectedCard(null)}
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
