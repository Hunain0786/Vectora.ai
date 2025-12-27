import uvicorn
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import data, auth
import config
import state
from services.data_service import clean_columns, clean_dataframe
from database import db

app = FastAPI()

@app.on_event("startup")
async def startup_db_client():
    await db.connect()

@app.on_event("shutdown")
async def shutdown_db_client():
    db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data.router)
app.include_router(auth.router, prefix="/auth", tags=["auth"])

# Attempt to load initial data
try:
    df = pd.read_csv(config.CSV_PATH)
    if df is not None:
        df = clean_columns(df)
        df = df.drop("Unnamed: 0", axis=1, errors='ignore')
        df = df.drop("Unnamed: 17", axis=1, errors='ignore')
        df = df.dropna()
        state.set_df(df)
        print(f"Loaded initial data from {config.CSV_PATH}")
except FileNotFoundError:
    print("Warning: Initial CSV not found. Waiting for upload.")
    state.set_df(None)
except Exception as e:
    print(f"Error loading initial CSV: {e}")
    state.set_df(None)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
