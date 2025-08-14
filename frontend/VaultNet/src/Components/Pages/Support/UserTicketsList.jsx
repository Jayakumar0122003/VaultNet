import { FaTicketSimple } from "react-icons/fa6";


export default function UserTicketsList({ tickets, loading }) {

  if (loading) {
    return (
      <div className="text-center py-10 text-main font-semibold">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className=" md:py-10">
        <h1 className="px-10 md:px-20 bg-main py-5 text-2xl md:text-3xl text-white font-semibold flex gap-2"><FaTicketSimple className="pt-1 text-4xl"/>Your Support Tickets</h1>
        <p className="px-5 md:px-24 text-xs italic text-gray-700 py-10 pb-0">
                ***Welcome to our Frequently Asked Questions (FAQ) section. Here you’ll find answers to the most common queries about our services, account management, security, and support. We designed this section to help you quickly find the information you need and resolve any concerns you may have. If your question is not listed, please don’t hesitate to reach out to our customer support team for personalized assistance.***
              </p>
        <div className="p-6 bg-white mt-5 px-5 md:px-30">
      <h2 className="text-2xl font-bold text-main mb-6 uppercase">
        Tickets
      </h2>

      {tickets.length === 0 ? (
  <p className="text-gray-600">You have not raised any support tickets yet.</p>
) : (
  <div
    className="space-y-6"
    style={{
      maxHeight: "480px", // Adjust height as needed to show ~6 tickets
      overflowY: "auto",
    }}
  >
    {tickets.map((ticket) => (
      <div
        key={ticket.id}
        className="border border-gray-300 rounded p-4 hover:shadow-md transition-shadow duration-300"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{ticket.subject}</h3>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              ticket.status === "OPEN"
                ? "bg-green-100 text-green-800"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {ticket.status}
          </span>
        </div>
        <p className="text-gray-700 mb-2 whitespace-pre-wrap">{ticket.message}</p>
        <p className="text-xs text-gray-400">
          Created At: {new Date(ticket.createdAt).toLocaleString()}
        </p>
      </div>
    ))}
  </div>
)}

    </div>
    </div>
  );
}
