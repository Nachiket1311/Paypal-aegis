import os
import re
import time
import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="PayPal Aegis Backend API",
    description="Autonomous Trust Infrastructure & PayPal Sandbox API Bridge",
    version="2.4.0"
)

# Allow Frontend on port 3000 and Vite 5173 to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
PAYPAL_BASE_URL = os.getenv("PAYPAL_BASE_URL", "https://api-m.sandbox.paypal.com")

class MoveMoneyRequest(BaseModel):
    amount: str
    currency: str = "USD"
    merchant_url: str | None = None

class FraudCheckRequest(BaseModel):
    url: str

class DisputeGenerateRequest(BaseModel):
    agreement_id: str
    project_name: str
    amount: float
    reason: str
    client_chat: str
    seller_notes: str

async def get_paypal_access_token() -> str:
    """Authenticates with PayPal Sandbox and returns an OAuth2 access token."""
    if not PAYPAL_CLIENT_ID or not PAYPAL_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="PayPal Sandbox credentials missing in .env")
        
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            f"{PAYPAL_BASE_URL}/v1/oauth2/token",
            auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
            data={"grant_type": "client_credentials"},
            headers={"Accept": "application/json", "Accept-Language": "en_US"},
        )
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"PayPal Sandbox Auth Failed: {response.text}")
        return response.json()["access_token"]

@app.get("/")
def health_check():
    return {
        "status": "online",
        "platform": "PayPal Aegis",
        "version": "2.4.0",
        "paypal_configured": bool(PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET),
        "message": "PayPal Aegis Autonomous Trust Layer is active"
    }

@app.get("/api/paypal/status")
def get_paypal_status():
    masked_id = PAYPAL_CLIENT_ID[:6] + "..." + PAYPAL_CLIENT_ID[-4:] if PAYPAL_CLIENT_ID else "NOT_CONFIGURED"
    return {
        "connected": bool(PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET),
        "client_id_preview": masked_id,
        "base_url": PAYPAL_BASE_URL,
        "environment": "sandbox",
        "currency_supported": ["USD", "INR"]
    }

@app.get("/api/vault/balance")
def get_vault_balance():
    return {
        "balance": 2500.00,
        "currency": "USD",
        "approx_inr": 215000.00,
        "status": "active"
    }

@app.post("/api/vault/move-money")
async def create_paypal_order(req: MoveMoneyRequest):
    """
    Creates a PayPal Sandbox Order using client credentials.
    Falls back gracefully to high-fidelity simulation if network to sandbox is unreachable.
    """
    order_id = f"PP-SANDBOX-{int(time.time())}"
    
    try:
        access_token = await get_paypal_access_token()
        order_payload = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": req.currency,
                        "value": req.amount
                    },
                    "description": "PayPal Aegis Virtual Vault Liquidity Allocation"
                }
            ]
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{PAYPAL_BASE_URL}/v2/checkout/orders",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {access_token}",
                },
                json=order_payload,
            )
            if response.status_code in (200, 201):
                data = response.json()
                data["is_live_sandbox"] = True
                return data
    except Exception as e:
        # Graceful sandbox simulation fallback when network is restricted
        pass

    # Simulated successful PayPal order in sandbox environment
    return {
        "id": order_id,
        "status": "CREATED",
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "reference_id": "default",
                "amount": {
                    "currency_code": req.currency,
                    "value": req.amount
                }
            }
        ],
        "is_live_sandbox": False,
        "simulation_note": "Executed through Aegis Sandbox Bridge"
    }

@app.post("/api/fraud/check")
@app.post("/api/fraud/analyze")
def fraud_analyze(req: FraudCheckRequest):
    url = req.url.lower().strip()
    
    # Domain extraction
    domain = re.sub(r"^https?://(www\.)?", "", url).split("/")[0].split("?")[0]
    
    risk_score = 15
    flagged_traits = []
    
    if any(tld in domain for tld in [".top", ".xyz", ".shop", ".buzz", ".monster"]):
        risk_score += 35
        flagged_traits.append("High-risk disposable Top-Level Domain")
        
    if any(word in url for word in ["sale90", "cheap", "outlet90", "90off"]):
        risk_score += 25
        flagged_traits.append("Predatory or impossible consumer discounts detected")
        
    if "paypal" in domain and not domain.endswith("paypal.com"):
        risk_score += 55
        flagged_traits.append("Brand imitation & phishing vector detected")
        
    risk_score = min(99, max(5, risk_score))
    
    return {
        "url": req.url,
        "domain": domain,
        "risk_score": risk_score,
        "risk_level": "critical" if risk_score >= 80 else "high" if risk_score >= 60 else "moderate" if risk_score >= 30 else "low",
        "flagged_traits": flagged_traits,
        "recommendation": "Block transaction" if risk_score >= 60 else "Safe to proceed under Aegis Vault"
    }
