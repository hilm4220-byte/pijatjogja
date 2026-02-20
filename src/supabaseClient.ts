import db, { auth, setSession, clearSession } from './db'

// Export db and auth to mimic Supabase API
export const supabase = {
  db,
  auth,
  from: (tableName: string) => db.from(tableName)
}

// Export auth functions directly
export { auth, setSession, clearSession }

// For backwards compatibility - some components import just 'supabase'
export default supabase
