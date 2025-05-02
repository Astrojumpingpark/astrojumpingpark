import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabaseClient';
import WarningModal from '../components/WarningModal';
import bellSound from '../audio/laser.mp3'; 

const KidsContext = createContext();

export function KidsProvider({ children }) {
  const [kids, setKids] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [warningModal, setWarningModal] = useState({ isOpen: false, message: '' });
  const [audio] = useState(new Audio(bellSound)); // Create Audio instance once

  // Move handleTimeUp into useCallback
  const handleTimeUp = useCallback(async (kidId) => {
    try {
      const { error } = await supabase
        .from('kids')
        .update({ inactive: true })
        .eq('id', kidId);

      if (error) throw error;
      // Update local state to reflect the change
      setKids(prevKids => prevKids.map(kid => 
        kid.id === kidId ? { ...kid, inactive: true } : kid
      ));
    } catch (error) {
      console.error('Error inactivating kid:', error);
    }
  }, []);

  const fetchKids = async () => {
    try {
      console.log('Fetching kids...');
      const { data, error } = await supabase
        .from('kids')
        .select('*')
        .eq('inactive', false)  // Changed from .is(null) to .eq(false)
        .order('starttime', { ascending: false });
      
      if (error) {
        console.error('Fetch error:', error);
        throw error;
      }
      console.log('Fetched data:', data);
      setKids(data || []);
    } catch (error) {
      console.error('Error fetching kids:', error);
    }
  };

  const handleAddKid = async (newKid) => {
    try {
      const kidData = {
        kidname: newKid.kidName,
        parentname: newKid.parentName,
        totaltime: newKid.totalTime,
        payment: newKid.payment || 0,
        starttime: new Date().toISOString(),
        inactive: false  // Add this field
      };

      const { data, error } = await supabase
        .from('kids')
        .insert([kidData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setKids(prevKids => [...prevKids, data]);
    } catch (error) {
      console.error('Error adding kid:', error);
    }
  };

  // First useEffect for fetching kids
  useEffect(() => {
    fetchKids(); // Initial fetch
    
    // Set up periodic refresh
    const refreshInterval = setInterval(() => {
      fetchKids();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  // Second useEffect for timer
  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date();
      const updatedTimeLeft = {};
      
      kids.forEach(kid => {
        const startTime = new Date(kid.starttime);
        const elapsedMinutes = Math.floor((currentTime - startTime) / 60000);
        const remainingMinutes = Math.max(0, kid.totaltime - elapsedMinutes);
        
        if (remainingMinutes === 0 && timeLeft[kid.id] > 0) {
          audio.currentTime = 0; // Reset audio to start
          audio.play()          // Play sound
            .catch(error => console.log("Audio play failed:", error));
            
          setWarningModal({
            isOpen: true,
            message: `Ha aterrizado la nave de ${kid.kidname}!`
          });
          handleTimeUp(kid.id);
        }
        
        updatedTimeLeft[kid.id] = remainingMinutes;
      });

      setTimeLeft(updatedTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [kids, timeLeft, handleTimeUp, audio]);

  return (
    <KidsContext.Provider value={{ kids, timeLeft, handleAddKid, handleTimeUp }}>
      {children}
      <WarningModal 
        isOpen={warningModal.isOpen}
        message={warningModal.message}
        onClose={() => setWarningModal({ isOpen: false, message: '' })}
      />
    </KidsContext.Provider>
  );
}

export function useKids() {
  return useContext(KidsContext);
}