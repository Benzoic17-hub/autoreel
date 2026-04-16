import { neon } from '@neondatabase/serverless'

const sql = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : () => { throw new Error('DATABASE_URL not set') }

export default sql
