import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link, useSearchParams } from 'react-router-dom';

export default function TicketsList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination params with default values
  const limit = parseInt(searchParams.get('limit')) || 10;
  const page = parseInt(searchParams.get('page')) || 1;
  const searchText = searchParams.get('search') || '';

  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true);
        const query = new URLSearchParams({
          limit: limit.toString(),
          page: page.toString(),
          search: searchText,
        });
        const res = await api.get(`/tickets?${query.toString()}`);
        setTickets(res.data.tickets || []);
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 1);
      } catch (err) {
        setError('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, [limit, page, searchText]);

  function onSearchChange(e) {
    setSearchParams({ limit: limit.toString(), page: '1', search: e.target.value });
  }

  function goToPage(newPage) {
    setSearchParams({ limit: limit.toString(), page: newPage.toString(), search: searchText });
  }

  if (loading) return <div>Loading tickets...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>Tickets List</h1>
      <input
        type="text"
        placeholder="Search tickets by title, desc or comments"
        value={searchText}
        onChange={onSearchChange}
      />
      <Link to="/tickets/new">
        <button>New Ticket</button>
      </Link>

      <ul>
        {Array.isArray(tickets) && tickets.length === 0 ? (
          <li>No tickets found.</li>
        ) : (
          tickets.map(ticket => (
            <li key={ticket._id}>
              <Link to={`/tickets/${ticket._id}`}>
                <strong>{ticket.title}</strong> - Status: {ticket.status} | Assigned to: {ticket.assignedTo?.name || 'Unassigned'} | SLA: {new Date(ticket.sla_deadline).toLocaleString()}
              </Link>
            </li>
          ))
        )}
      </ul>

      <div>
        <button disabled={page <= 1} onClick={() => goToPage(page - 1)}>Previous</button>
        <span> Page {page} of {pages} (Total: {total}) </span>
        <button disabled={page >= pages} onClick={() => goToPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
