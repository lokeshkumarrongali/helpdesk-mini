import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Timeline from '../components/Timeline.jsx';
import Comments from '../components/Comments.jsx';

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTicket() {
      try {
        const res = await api.get(`/tickets/${id}`);
        setTicket(res.data);
      } catch {
        setError('Failed to fetch ticket data');
      } finally {
        setLoading(false);
      }
    }
    fetchTicket();
  }, [id]);

  const now = new Date();
  const slaDate = ticket && ticket.sla_deadline ? new Date(ticket.sla_deadline) : null;
  const breached = slaDate && slaDate < now;

  if (loading) return <div>Loading ticket details...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!ticket) return <div>No ticket found</div>;

  return (
    <div>
      <h2>Ticket #{ticket._id}: {ticket.title}</h2>
      <p>Status: {ticket.status}</p>
      <p>Assigned To: {ticket.assignedTo?.name || 'Unassigned'}</p>
      <p>Description:</p>
      <p>{ticket.description}</p>
      <p>
        SLA Due: {slaDate ? slaDate.toLocaleString() : "Not Set"}{" "}
        {slaDate && breached && <strong style={{ color: 'red' }}> (Breached)</strong>}
      </p>

      <hr />

      <Timeline logs={ticket.logs} />
      <Comments ticketId={ticket._id} initialComments={ticket.comments} />
    </div>
  );
}
