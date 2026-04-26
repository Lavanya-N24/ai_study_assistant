"""Quick smoke test for the auth system."""
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import json

BASE = "http://localhost:8000"

def post(path, data=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode() if data else None
    req = Request(f"{BASE}{path}", data=body, headers=headers, method="POST")
    try:
        resp = urlopen(req)
        return resp.status, json.loads(resp.read())
    except HTTPError as e:
        return e.code, json.loads(e.read())

def get(path, token=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = Request(f"{BASE}{path}", headers=headers, method="GET")
    try:
        resp = urlopen(req)
        return resp.status, json.loads(resp.read())
    except HTTPError as e:
        return e.code, json.loads(e.read())

# --- Test 1: Protected route without token should return 422 (missing header) ---
print("=" * 50)
print("TEST 1: Chat without token")
status, body = post("/chat/", {"question": "hello", "top_k": 4})
print(f"  Status: {status} (expected 422)")
print(f"  Body: {body}")

# --- Test 2: Login with existing user ---
print("\nTEST 2: Login")
status, body = post("/auth/login", {"email": "test@example.com", "password": "test123"})
print(f"  Status: {status} (expected 200)")
token = body.get("token", "")
print(f"  Got token: {token[:30]}...")

# --- Test 3: Protected route WITH token should pass auth (may 404 if no PDF) ---
print("\nTEST 3: Chat with token")
status, body = post("/chat/", {"question": "hello", "top_k": 4}, token=token)
print(f"  Status: {status} (expected 404 = auth passed, no PDF indexed)")
print(f"  Body: {body}")

# --- Test 4: Summary without token ---
print("\nTEST 4: Summary without token")
status, body = get("/summary/")
print(f"  Status: {status} (expected 422)")

print("\n" + "=" * 50)
print("ALL TESTS DONE")
