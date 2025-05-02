import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jmyqrvwqixlbllyjlmpj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteXFydndxaXhsYmxseWpsbXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1ODUyMzksImV4cCI6MjA2MDE2MTIzOX0.5bbUUxRKIriqGoNaTnYGOblhnA-rD-QW6TA5u03cE08';

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
};

export const supabase = createClient(supabaseUrl, supabaseKey, options);