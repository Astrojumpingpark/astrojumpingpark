import React, { useState } from 'react';
import { useKids } from '../context/KidsContext';

function EntryForm() {
  const { handleAddKid } = useKids();
  const [kidName, setKidName] = useState('');
  const [parentName, setParentName] = useState('');
  const [totalTime, setTotalTime] = useState('');
  const [payment, setPayment] = useState('');
  const [numberOfChildren, setNumberOfChildren] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newKid = {
      kidName: kidName,
      parentName: parentName,
      totalTime: parseInt(totalTime),
      payment: parseFloat(payment),
      startTime: new Date().toISOString(),
      numberOfChildren: parseInt(numberOfChildren)
    };

    await handleAddKid(newKid);
    
    // Clear form
    setKidName('');
    setParentName('');
    setTotalTime('');
    setPayment('');
    setNumberOfChildren('');
  };

  return (
    <div className="entry-form">
      <h2 className="titulo2">Registro de niños</h2>
        <form onSubmit={handleSubmit}>
        <div>
          <label>Cantidad de niños:</label>
          <input
            type="number"
            value={numberOfChildren}
            onChange={(e) => setNumberOfChildren(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nombre del niño:</label>
          <input
            type="text"
            value={kidName}
            onChange={(e) => setKidName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Acompañante:</label>
          <input
            type="text"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Minutos:</label>
          <input
            type="number"
            value={totalTime}
            onChange={(e) => setTotalTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Monto pagado:</label>
          <input
            type="number"
            step="0.01"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            required
          />
        </div>
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
}

export default EntryForm;