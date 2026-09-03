import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const fallbackUrl = 'https://tkmcpckbvagyplolrjsz.supabase.co';
const supabaseUrl = (rawUrl && typeof rawUrl === 'string' && rawUrl.startsWith('http')) ? rawUrl : fallbackUrl;

const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbWNwY2tidmFneXBsb2xyanN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMTk2NDksImV4cCI6MjEwMzg5NTY0OX0.UsuiLQgHisg-MNmgDFqmOLSdADKExSFUKHMNn5mRV6c';
const supabaseKey = (rawKey && typeof rawKey === 'string' && rawKey.startsWith('ey')) ? rawKey : fallbackKey;

export const supabase = createClient(supabaseUrl, supabaseKey);

