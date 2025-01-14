import React from 'react';
import PropTypes from 'prop-types';

export function StatsCard({ title, count }) {
  return (
    <div className="stat-card">
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{count}</p>
    </div>
  );
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired
};
  
  