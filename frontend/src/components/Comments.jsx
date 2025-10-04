import { useState } from 'react';
import api from '../services/api';

export default function Comments({ ticketId, initialComments }) {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function addComment() {
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.post(`/tickets/${ticketId}/comments`, { text: newComment });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch {
      setError('Failed to add comment');
    } finally {
      setLoading(false);
    }
  }

  async function deleteComment(id) {
    try {
      await api.delete(`/tickets/${ticketId}/comments/${id}`);
      setComments(comments.filter((c) => c._id !== id));
    } catch {
      setError('Failed to delete comment');
    }
  }

  return (
    <div>
      <h4>Comments</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            <b>{comment.author?.name || 'Unknown'}</b> ({new Date(comment.createdAt).toLocaleString()}):<br />
            {comment.text}
            {/* Add edit UI here if desired */}
            <button onClick={() => deleteComment(comment._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <textarea
        rows={3}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment"
      />
      <br />
      <button onClick={addComment} disabled={loading}>Add Comment</button>
    </div>
  );
}
