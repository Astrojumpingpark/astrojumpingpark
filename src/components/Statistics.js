import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Statistics.css';

function Statistics() {
  const [dailyStats, setDailyStats] = useState([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const { data, error } = await supabase
        .from('kids')
        .select('starttime, numberOfChildren, payment');

      if (error) throw error;

      // Agrupar datos por día
      const statsMap = data.reduce((acc, kid) => {
        const date = new Date(kid.starttime).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { date, count: 0, totalPayment: 0 };
        }
        acc[date].count += kid.numberOfChildren || 1;
        acc[date].totalPayment += kid.payment || 0;
        return acc;
      }, {});

      // Convertir a array y ordenar por fecha
      const statsArray = Object.values(statsMap).sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );

      setDailyStats(statsArray);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const formatCurrency = (value) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="statistics">
      <h2 className="titulo2">Estadísticas</h2>
      
      <div className="chart-container">
        <h3>Registros por Día</h3>
        <BarChart width={800} height={300} data={dailyStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="Cantidad de Registros" />
        </BarChart>
      </div>

      <div className="chart-container">
        <h3>Ingresos por Día</h3>
        <BarChart 
          width={800} 
          height={300} 
          data={dailyStats}
          margin={{ top: 20, right: 30, left: 60, bottom: 5 }}  // Ajustado el margen izquierdo
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            tickFormatter={formatCurrency}
            width={80}  // Ancho fijo para el eje Y
          />
          <Tooltip formatter={(value) => [`${formatCurrency(value)}`, 'Total Ingresos']} />
          <Legend />
          <Bar dataKey="totalPayment" fill="#82ca9d" name="Total Ingresos ($)" />
        </BarChart>
      </div>
    </div>
  );
}

export default Statistics;