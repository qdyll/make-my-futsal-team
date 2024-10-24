import React from 'react';
import './TeamDisplay.css';

const TeamDisplay = ({ teams, showDetails, calculateAverageRating }) => {

  // Function to check if all players in a team have the neutral rating of 3
  const allPlayersNeutral = (team) => {
    return team.every(player => player.rating === 3);
  };

  return (
    <div className="teams-container">
      {teams.map((team, index) => (
        <div key={index} className="team-card">
          <h4>
            Team {index + 1}: {team.length} players
          </h4>

          {/* Only show average rating if not all players have the neutral rating */}
          {!allPlayersNeutral(team) && (
            <h4>
              Average Rating: {calculateAverageRating(team).toFixed(2)}
            </h4>
          )}
          
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                {showDetails && <th>Rating</th>}
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
