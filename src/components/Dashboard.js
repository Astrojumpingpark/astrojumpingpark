import React from 'react';
import { useKids } from '../context/KidsContext';
import './Dashboard.css';

function Dashboard() {
  const { kids, timeLeft } = useKids();

  return (
    <div className="dashboard-container">
      
      <div className="table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Astronauta</th>
              <th>Acompañante</th>
              <th>Tiempo restante</th>
            </tr>
          </thead>
          <tbody>
            {kids.map(kid => (
              <tr key={kid.id}>
                <td>{kid.kidname}</td>
                <td>{kid.parentname}</td>
                <td>{timeLeft[kid.id] || 0} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;