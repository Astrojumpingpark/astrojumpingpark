import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import './Statistics.css';

function Statistics() {
  const [dailyStats, setDailyStats] = useState([]);
  const [hourlyStats, setHourlyStats] = useState([]);
  const [totalChildren, setTotalChildren] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchStatistics = useCallback(async () => {
    try {
      // Calcular la fecha de hace 8 días
      const eightDaysAgo = new Date();
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
      eightDaysAgo.setHours(0, 0, 0, 0);

      // Calcular el inicio del día actual
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let query = supabase
        .from('kids')
        .select('starttime, numberOfChildren, payment')
        .order('starttime', { ascending: true });

      if (dateRange.startDate) {
        query = query.gte('starttime', dateRange.startDate);
      } else {
        query = query.gte('starttime', eightDaysAgo.toISOString());
      }
      
      if (dateRange.endDate) {
        query = query.lte('starttime', dateRange.endDate + 'T23:59:59');
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calcular el total de niños y el total de ingresos
      const total = data.reduce((sum, kid) => sum + (kid.numberOfChildren || 1), 0);
      const totalPayment = data.reduce((sum, kid) => sum + (kid.payment || 0), 0);
      setTotalChildren(total);
      setTotalIncome(totalPayment);

      const statsMap = data.reduce((acc, kid) => {
        const date = new Date(kid.starttime).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { date, count: 0, totalPayment: 0 };
        }
        acc[date].count += kid.numberOfChildren || 1;
        acc[date].totalPayment += kid.payment || 0;
        return acc;
      }, {});

      // Convertir a array y ordenar cronológicamente
      // Ya no necesitamos ordenar aquí porque los datos vienen ordenados de Supabase
      let statsArray = Object.values(statsMap);

      setDailyStats(statsArray);

      // Obtener datos por hora del día actual
      const hourlyData = data.filter(kid => {
        const kidDate = new Date(kid.starttime);
        return kidDate >= today;
      });

      const hourlyMap = hourlyData.reduce((acc, kid) => {
        const hour = new Date(kid.starttime).getHours();
        if (!acc[hour]) {
          acc[hour] = { hour: `${hour}:00`, count: 0 };
        }
        acc[hour].count += kid.numberOfChildren || 1;
        return acc;
      }, {});

      // Calcular promedios por hora de todos los días
      const allHourlyData = data.reduce((acc, kid) => {
        const hour = new Date(kid.starttime).getHours();
        if (!acc[hour]) {
          acc[hour] = { count: 0, days: new Set() };
        }
        acc[hour].count += kid.numberOfChildren || 1;
        acc[hour].days.add(new Date(kid.starttime).toDateString());
        return acc;
      }, {});

      // Crear array con todas las horas y sus promedios
      const hourlyArray = Array.from({ length: 24 }, (_, i) => {
        const currentHourData = hourlyMap[i] || { hour: `${i}:00`, count: 0 };
        const avgData = allHourlyData[i];
        const average = avgData ? avgData.count / avgData.days.size : 0;
        return {
          hour: `${i}:00`,
          count: currentHourData.count,
          average: Math.round(average * 100) / 100
        };
      });

      setHourlyStats(hourlyArray);

    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  }, [dateRange]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP'
    }).format(value);
  };

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics, dateRange]);

  return (
    <div className="statistics">
      <h2 className="titulo2">Estadísticas</h2>
      
      <div className="stats-summary">
        <div className="stats-card">
          <h3>Total de Astronautas</h3>
          <p className="stats-number">{totalChildren}</p>
        </div>
        <div className="stats-card">
          <h3>Total de Ingresos</h3>
          <p className="stats-number">{formatCurrency(totalIncome)}</p>
        </div>
      </div>

      <div className="date-filter">
        <div className="date-input">
          <label>Desde:</label>
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="date-input">
          <label>Hasta:</label>
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
          />
        </div>
      </div>
      
      <div className="chart-container">
        <h3>Registros por Día</h3>
        <BarChart 
          width={800} 
          height={300} 
          data={dailyStats}
          margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
        >
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
          margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            tickFormatter={formatCurrency}
            width={80}
          />
          <Tooltip formatter={(value) => [`${formatCurrency(value)}`, 'Total Ingresos']} />
          <Legend />
          <Bar dataKey="totalPayment" fill="#82ca9d" name="Total Ingresos ($)" />
        </BarChart>
      </div>
      
      <div className="chart-container">
        <h3>Niños por Hora (Último día)</h3>
        <LineChart
          width={800}
          height={300}
          data={hourlyStats}
          margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#8884d8" 
            name="Cantidad de Niños"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="average" 
            stroke="#82ca9d" 
            name="Promedio Histórico"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={{ r: 3 }}
          />
        </LineChart>
      </div>
    </div>
  );
}

export default Statistics;