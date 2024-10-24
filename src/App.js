import React, { useState } from 'react';
import PlayerTable from './PlayerTable';
import TeamDisplay from './TeamDisplay';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [numPlayers, setNumPlayers] = useState(10);
  const [numTeams, setNumTeams] = useState(3);
  const [players, setPlayers] = useState(Array.from({ length: 10 }, () => ({
    id: uuidv4(),
    name: '',
    rating: '3 (Neutral)',
  })));
  const [previousTeams, setPreviousTeams] = useState([]); // Store last shuffled teams
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [canRandomize, setCanRandomize] = useState(true);
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  const [namesText, setNamesText] = useState("");

  // Toggle collapse
  const toggleDescriptionCollapse = () => {
    setIsDescriptionCollapsed(!isDescriptionCollapsed);
  };

  const handleNumPlayersChange = (newNumPlayers) => {
    if (newNumPlayers > players.length) {
      const additionalPlayers = Array.from({ length: newNumPlayers - players.length }, () => ({
        id: uuidv4(),
        name: '',
        rating: 5,
      }));
      setPlayers((prevPlayers) => [...prevPlayers, ...additionalPlayers]);
    } else {
      setPlayers((prevPlayers) => prevPlayers.slice(0, newNumPlayers));
    }
    setNumPlayers(newNumPlayers);
  };

  const incrementPlayers = () => handleNumPlayersChange(numPlayers + 1);
  const decrementPlayers = () => handleNumPlayersChange(numPlayers > 1 ? numPlayers - 1 : 1);

  const toggleTableCollapse = () => setIsTableCollapsed(!isTableCollapsed);

  const handleNamesTextChange = (e) => {
    setNamesText(e.target.value);
  };

  const populateTableFromNames = () => {
    const nameLines = namesText.split('\n').filter(line => line.trim() !== '');
    
    const parsedNames = nameLines
      .filter(line => /^\d+\.\s*/.test(line))
      .map(line => {
        const name = line.replace(/^\d+\.\s*/, '').trim();
        return { id: uuidv4(), name, rating: 3 };
      })
      .filter(player => player.name !== '');

    setPlayers(parsedNames);
    setNumPlayers(parsedNames.length);
    setNamesText("");
  };

  const calculateTeamsWithPairing = () => {
    const strongPlayers = players.filter(player => player.rating >= 4); 
    const weakPlayers = players.filter(player => player.rating <= 2);  
    const neutralPlayers = players.filter(player => player.rating > 2 && player.rating < 4);  

    setPreviousTeams(teams);

    let newTeams = Array.from({ length: numTeams }, () => []);

    let teamIndex = 0;
    [...strongPlayers, ...weakPlayers].forEach((player) => {
      newTeams[teamIndex % numTeams].push(player);
      teamIndex++;
    });

    const shuffledNeutralPlayers = shuffleArray(neutralPlayers);
    shuffledNeutralPlayers.forEach((player) => {
      newTeams[teamIndex % numTeams].push(player);
      teamIndex++;
    });

    const allPlayersAssigned = newTeams.flat().length === players.length;

    if (!allPlayersAssigned) {
      const remainingPlayers = players.filter(p => !newTeams.flat().includes(p));
      remainingPlayers.forEach((player) => {
        newTeams[teamIndex % numTeams].push(player);
        teamIndex++;
      });
    }

    setTeams(newTeams);
    setMessage('Teams balanced with strong, weak, and neutral players.');
  };

  const resetOptimization = () => {
    const resetPlayers = players.map(player => ({
      ...player,
      rating: 3
    }));

    setPlayers(resetPlayers);
    setTeams([]);
    setMessage('');
  };
  
  const randomizeTeams = () => {
    if (canRandomize) {
      setPreviousTeams(teams);
      const shuffledPlayers = shuffleArray(players);
      setPlayers(shuffledPlayers);
      resetOptimization();
      setCanRandomize(false);
    }
  };

  const undoRandomTeams = () => {
    if (previousTeams.length > 0) {
      setTeams(previousTeams);
      setMessage('Reverted to the previous team assignment.');
      setCanRandomize(true);
    }
  };

  const handlePlayerChange = (newPlayers) => {
    setPlayers(newPlayers);
    resetOptimization();
    setCanRandomize(true);
  };

  const calculateAverageRating = (team) => {
    if (!team || team.length === 0) return 0;
    const totalRating = team.reduce((acc, player) => {
      const rating = parseFloat(player.rating);
      return acc + (isNaN(rating) ? 0 : rating);
    }, 0);

    const average = totalRating / team.length;
    return isNaN(average) ? 0 : average;
  };

  const shuffleArray = (array) => {
    const clonedArray = [...array];
    for (let i = clonedArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clonedArray[i], clonedArray[j]] = [clonedArray[j], clonedArray[i]];
    }
    return clonedArray;
  };

  const copyNamesToClipboard = () => {
    const formattedNames = teams.map((team, index) => {
      const teamHeader = `Team ${index + 1}`;
      const teamNames = team.map(player => player.name).join('\n');
      return `${teamHeader}\n${teamNames}`;
    }).join('\n\n');

    navigator.clipboard.writeText(formattedNames)
      .then(() => alert("Team names copied to clipboard!"))
      .catch(err => console.error("Error copying to clipboard:", err));
  };

  return (
    <div className="App container">
      <h1>Make My Futsal Team</h1>

      <p className="info text-primary font-weight-bold">
        ℹ️ Keep all player ratings the same to create random teams balanced only by ratings.
      </p>

      <div className="mb-3">
        <button className="btn btn-info" onClick={toggleDescriptionCollapse}>
          {isDescriptionCollapsed ? "Show" : "Hide"} How This App Works
        </button>
        <div className={`collapse ${!isDescriptionCollapsed ? 'show' : ''}`}>
          <div className="mt-3">
            <p>This app helps you balance futsal teams based on player ratings.</p>
            <p>Players are rated on a scale from <strong>1 to 5</strong>:</p>
            <ul>
              <li><strong>1</strong> - Weak (lowest skill level)</li>
              <li><strong>3</strong> - Neutral (default rating)</li>
              <li><strong>5</strong> - Strong (highest skill level)</li>
            </ul>
            <p>To maintain fair teams, strong and weak players are evenly distributed across teams.</p>
            <p>Players with a neutral rating are randomly assigned to teams. You can adjust player ratings and recalculate teams for better balance.</p>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="namesText">Paste list from Telegram:</label>
        <textarea
          id="namesText"
          value={namesText}
          onChange={handleNamesTextChange}
          placeholder={`7 Nov, THURSDAY, SAFRA TAMPINES, 9PM - 11PM. Pitch 4\n1.Name \n2.Name...`}
          className="form-control"
          rows="4"
        />
        <button className="btn btn-primary mt-2" onClick={populateTableFromNames}>
          Populate Table
        </button>
      </div>

      <div className="mb-3">
        <button className="btn btn-secondary" onClick={toggleTableCollapse}>
          {isTableCollapsed ? "Show Player Input Table" : "Hide Player Input Table"}
        </button>
      </div>

      {!isTableCollapsed && (
        <PlayerTable players={players} setPlayers={handlePlayerChange} showDetails={true} />
      )}

      <div className="mb-3">
        <label htmlFor="numTeams">Number of Teams:</label>
        <input
          type="number"
          id="numTeams"
          value={numTeams}
          onChange={(e) => setNumTeams(parseInt(e.target.value, 10))}
          min="2"
          className="form-control"
        />
      </div>

      <div className="d-flex flex-wrap mt-3">
        <button className="btn btn-primary mr-2" onClick={calculateTeamsWithPairing}>
          Balance Teams
        </button>

        <button className="btn btn-danger" onClick={undoRandomTeams}>
          Undo Shuffle
        </button>

        <button className="btn btn-secondary mr-2" onClick={resetOptimization}>
          Reset Teams
        </button>
      </div>

      {message && (
        <p className="text-danger font-weight-bold mt-3">
          {message}
        </p>
      )}

      <div className="form-check mt-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={showDetails}
          onChange={() => setShowDetails(!showDetails)}
        />
        <label className="form-check-label">
          Show Rating in Team Columns
        </label>
      </div>

      {teams.length > 0 && (
        <>
          <button className="btn btn-info mt-3" onClick={copyNamesToClipboard}>
            Copy Names to Clipboard
          </button>
          <TeamDisplay
            teams={teams}
            showDetails={showDetails}
            calculateAverageRating={calculateAverageRating}
          />
        </>
      )}

      <Footer />
    </div>
  );
}

export default App;
