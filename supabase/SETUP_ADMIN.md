# Setting Up Admin Access

## Step 1: Run Migrations (First Time Setup)

The `user_roles` table needs to be created first. Go to your **Supabase Dashboard** > **SQL Editor** and run these migration files in order:

### Migration 1: Create Leads Table
Run the contents of `supabase/migrations/20260106063257_d8c21ee2-2600-45f3-b3cc-29772448e94c.sql`

### Migration 2: Create Newsletter Table
Run the contents of `supabase/migrations/20260106075130_b8df4434-438d-4936-a92d-ec345afd780f.sql`

### Migration 3: Create User Roles Table ⭐ (Most Important)
Run the contents of `supabase/migrations/20260107084938_1d0a53b3-d386-49d4-87ea-f1c9a1be4562.sql`

## Step 2: Create Admin User

1. **Register** a user account on your website (or use an existing one)
2. Go to **Supabase Dashboard** > **Authentication** > **Users**
3. Copy the **User UUID** of the account you want to make admin
4. In **SQL Editor**, run:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('PASTE_UUID_HERE', 'admin');
```

5. Refresh your website and navigate to `/admin` - you should now have access!

## Alternative: Use Supabase CLI (if installed)

If you have Supabase CLI installed, you can simply run:

```bash
supabase db push
```

This will automatically run all pending migrations.
