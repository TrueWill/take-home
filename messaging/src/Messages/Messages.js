import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Messages({
  sourceId,
  status,
  messages,
  page,
  fetchMessagesForSource
}) {
  useEffect(
    () => {
      fetchMessagesForSource(sourceId, status, page);
    },
    [sourceId, status]
  );

  const items = messages.map(message => (
    <li key={message.id}>
      ID: {message.id} Message: {message.message} Status: {message.status}
    </li>
  ));

  return (
    <div>
      <Link to={'/source/' + sourceId}>Back</Link>
      <h4>Messages for Source ID {sourceId}</h4>
      {status && <div>Filter: Status = {status}</div>}
      <ul>{items}</ul>
    </div>
  );
}

Messages.propTypes = {
  sourceId: PropTypes.string.isRequired,
  status: PropTypes.string,
  page: PropTypes.number,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      updated_at: PropTypes.string
    })
  ).isRequired,
  fetchMessagesForSource: PropTypes.func.isRequired
};

export default Messages;
