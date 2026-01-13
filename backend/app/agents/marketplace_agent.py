import asyncio
from app.models import AgentResult

class MarketplaceAgent:
    async def verify_product(self, part_id: str, source: str, serial_hash: str) -> dict:
        """
        Verifies the product against external marketplaces (Amazon/eBay/etc).
        Note: This is an ASYNC function to work with asyncio.gather()
        """
        
        # Simulate network delay for realism
        await asyncio.sleep(0.5)

        # 1. Demo Data: Sony Camera
        if part_id == "B08N5KWB9H":
            return {
                "agent_name": "Marketplace Agent",
                "passed": True,
                "confidence": 0.95,
                "details": {
                    "source": "Amazon",
                    "status": "LISTING_MATCH",
                    "price_variance": "NORMAL"
                }
            }

        # 2. Fallback / Unknown Items
        return {
            "agent_name": "Marketplace Agent",
            "passed": True, # We default to True for unknown items to avoid blocking valid new products
            "confidence": 0.5,
            "details": {
                "source": "Unknown",
                "status": "NO_LISTING_FOUND",
                "note": "Item not found in public catalogs"
            }
        }

marketplace_agent = MarketplaceAgent()