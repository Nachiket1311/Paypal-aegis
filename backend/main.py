import os
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Vault & Fraud Detection API")

# Allow Person 2's Next.js app (localhost:3000) to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
PAYPAL_BASE_URL = os.getenv("PAYPAL_BASE_URL", "https://api-m.sandbox.paypal.com")

class MoveMoneyRequest(BaseModel):
    amount: str
    currency: str = "USD"
    merchant_url: str | None = None

async def get_paypal_access_token() -> str:
    """Authenticates with PayPal Sandbox and returns an OAuth2 access token."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{PAYPAL_BASE_URL}/v1/oauth2/token",
            auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
            data={"grant_type": "client_credentials"},
            headers={"Accept": "application/json", "Accept-Language": "en_US"},
        )
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="PayPal Sandbox Auth Failed")
        return response.json()["access_token"]

@app.get("/")
def health_check():
    return {"status": "online", "message": "FastAPI Server is ready for Next.js and AI modules"}

@app.get("/api/vault/balance")
def get_vault_balance():
    # Mock balance for Person 2's Day 1 "Vault" UI screen
    return {"balance": 2500.00, "currency": "USD"}

@app.post("/api/vault/move-money")
async def create_paypal_order(req: MoveMoneyRequest):
    """Creates a Sandbox PayPal Order when Person 2's 'Move Money' button is clicked."""
    access_token = await get_paypal_access_token()
    
    order_payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": req.currency,
                    "value": req.amount
                }
            }
        ]
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{PAYPAL_BASE_URL}/v2/checkout/orders",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
            json=order_payload,
        )
        if response.status_code not in (200, 201):
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()

@app.post("/api/fraud/check")
def fraud_check(url: str):
    # Placeholder for Person 3's 5 common "Scam Site" traits and AI prompt integration
    return {"url": url, "risk_score": "low", "flagged_traits": []}