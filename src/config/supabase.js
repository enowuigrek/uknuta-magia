import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fksjhpfgxodrdawjfyzt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2pocGZneG9kcmRhd2pmeXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTk2ODYsImV4cCI6MjA2NjgzNTY4Nn0.C7i-hKcXPIafpuNjfCRQr-VfSXalH4L6d4q8trPz-_Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)