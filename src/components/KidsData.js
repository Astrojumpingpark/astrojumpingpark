import React from 'react';
import { useKids } from '../context/KidsContext';

function KidsData() {
  const { kids } = useKids();

  return (
    <div className="kids-data">
      <h2>Complete Kids Data</h2>
      <table>
        <thead>
          <tr>
            <th>Kid's Name</th>
            <th>Parent's Name</th>
            <th>Total Time (min)</th>
            <th>Payment ($)</th>
            <th>Start Time</th>
          </tr>
        </thead>
        <tbody>
          {kids.map(kid => (
            <tr key={kid.id}>
              <td>{kid.kidname}</td>
              <td>{kid.parentname}</td>
              <td>{kid.totaltime}</td>
              <td>{kid.payment}</td>
              <td>{new Date(kid.starttime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KidsData;