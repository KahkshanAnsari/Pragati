from supabase import create_client, Client
from app.core.config import settings

# Used for admin/backend operations that need elevated privileges
supabase_admin: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

# Used for regular operations if needed (though usually we'll pass the user's token)
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
