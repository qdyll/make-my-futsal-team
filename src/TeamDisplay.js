import React from 'react';
import './TeamDisplay.css';

const TeamDisplay = ({ teams, showDetails, calculateAverageRating }) => {
  return (
    <div className="teams-container">
      {teams.map((team, index) => (
        <div key={index} className="team-card">
          <h4>
            Team {index + 1}: {team.length} players
          </h4>
          <h4>
            Average Rating: {calculateAverageRating(team).toFixed(2)}
          </h4>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                {showDetails && (
                  <>
                    <th>Name</th>
                    <th>Rating</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {team.map((player) => (
                <tr key={player.id}>
                  <td>{player.name}</td>
                  {showDetails && <td>{player.rating}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default TeamDisplay;
