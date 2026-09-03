from datetime import datetime
from app.db.supabase import supabase_admin
import logging

logger = logging.getLogger(__name__)

async def log_audit(actor_id: str, actor_role: str, action: str, entity_type: str, entity_id: str, previous_value: dict = None, new_value: dict = None):
    try:
        data = {
            "actor_id": actor_id,
            "actor_role": actor_role,
            "action": action,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "previous_value": previous_value,
            "new_value": new_value,
            "created_at": datetime.utcnow().isoformat()
        }
        supabase_admin.table("audit_logs").insert(data).execute()
    except Exception as e:
        logger.error(f"Failed to log audit event: {str(e)}")
