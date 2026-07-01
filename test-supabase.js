const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.log("Error: .env.local missing vars");
  process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
  console.log("Checking bucket 'photobooth'...");
  const { data, error } = await supabase.storage.getBucket('photobooth');
  if (error) {
    console.log("Bucket error:", error.message);
  } else {
    console.log("Bucket exists:", data.name);
  }
}

test();
