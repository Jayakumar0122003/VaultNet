import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from '../../../axiosInstance';
import { AuthContext } from '../../Context/AuthContext';
import RaiseTicketForm from "./RaiseTicketForm";
import UserTicketsList from './UserTicketsList';
import SupportStrip from "./SupportStrip";

function SupportApi() {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const userId = user?.id; // ✅ fixed lowercase i
  const accessToken = localStorage.getItem("accessToken");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/customer/get-all-users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data && res.data.ticket) {
        setTickets(res.data.ticket);
      } else {
        setTickets([]);
        toast.info("No tickets found.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTickets();
    }
  }, [userId, accessToken]);

  return (
    <>
      <RaiseTicketForm fetchTickets={fetchTickets} /> {/* ✅ pass refresh */}
      <SupportStrip />
      <UserTicketsList tickets={tickets} loading={loading} /> {/* ✅ fixed prop */}
    </>
  );
}

export default SupportApi;
