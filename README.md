Use cd to change into the app's directory

cd with-supabase-app
Rename .env.example to .env.local and update the following:

NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
Both NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY can be found in your Supabase project's API settings

You can now run the Next.js local development server:

npm run dev
The starter kit should now be running on localhost:3000.

This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete components.json and re-install shadcn/ui