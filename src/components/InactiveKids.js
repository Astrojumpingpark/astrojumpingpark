import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import './InactiveKids.css';

function InactiveKids() {
  const [inactiveKids, setInactiveKids] = useState([]);

  useEffect(() => {
    fetchInactiveKids();
  }, []);

  const fetchInactiveKids = async () => {
    try {
      const { data, error } = await supabase
        .from('kids')
        .select('*')
        .eq('inactive', true)
        .order('starttime', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Ordenar los datos por hora de aterrizaje
      const sortedData = (data || []).sort((a, b) => {
        const endTimeA = new Date(a.starttime).getTime() + (a.totaltime * 60000);
        const endTimeB = new Date(b.starttime).getTime() + (b.totaltime * 60000);
        return endTimeB - endTimeA; // Orden descendente
      });

      setInactiveKids(sortedData);
    } catch (error) {
      console.error('Error fetching inactive kids:', error);
    }
  };

  const calculateEndTime = (startTime, totalMinutes) => {
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + totalMinutes);
    return endTime.toLocaleString();
  };

  return (
    <div className="inactive-kids">
      <h2 className="titulo2">Ultimos aterrizajes</h2>
      <div className="table-container">
        <table className="inactive-table">
          <thead>
            <tr>
              <th>Astronauta</th>
              <th>Acudiente</th>
              <th>Tiempo</th>
              <th>Hora inicio</th>
              <th>Hora aterrizaje</th>
            </tr>
          </thead>
          <tbody>
            {inactiveKids.map(kid => (
              <tr key={kid.id}>
                <td>{kid.kidname}</td>
                <td>{kid.parentname}</td>
                <td>{kid.totaltime} min</td>
                <td>{new Date(kid.starttime).toLocaleString()}</td>
                <td>{calculateEndTime(kid.starttime, kid.totaltime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InactiveKids;