import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://tkmcpckbvagyplolrjsz.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbWNwY2tidmFneXBsb2xyanN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMTk2NDksImV4cCI6MjEwMzg5NTY0OX0.UsuiLQgHisg-MNmgDFqmOLSdADKExSFUKHMNn5mRV6c';

export const supabase = createClient(supabaseUrl, supabaseKey);

