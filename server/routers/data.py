from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
import pandas as pd
import io
import state
import config
from models import QueryRequest
from services.data_service import (
    clean_columns, clean_dataframe, advanced_clean_dataframe, build_column_schema
)
from services.analysis_service import (
    run_plan, build_api_response, explain_data_cleaning
)
from services.llm_service import (
    llm_build_plan
)

router = APIRouter()

@router.post("/clean")
def clean_data():
    df = state.get_df()

    if df is None:
        raise HTTPException(status_code=400, detail="No data loaded")

    cleaned_df = clean_dataframe(df)

    output_path = "cleaned_data.csv"
    cleaned_df.to_csv(output_path, index=False)

    return FileResponse(
        output_path,
        filename="cleaned_data.csv",
        media_type="text/csv"
    )

@router.post("/clean/advanced")
def advanced_clean(target: str | None = None, problem_type: str = "general"):
    df = state.get_df()

    if df is None:
        raise HTTPException(status_code=400, detail="No data loaded")

    cleaned_df, report = advanced_clean_dataframe(df, target, problem_type)

    output_path = "cleaned_advanced.csv"
    cleaned_df.to_csv(output_path, index=False)

    explanation = explain_data_cleaning(report)

    return {
        "message": "Data cleaned using analyst-grade logic",
        "summary": explanation,
        "report": report,
        "download": "/download/advanced"
    }

@router.get("/download/advanced")
def download_advanced():
    return FileResponse(
        "cleaned_advanced.csv",
        filename="cleaned_advanced.csv",
        media_type="text/csv"
    )

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        
        if file.filename.endswith('.csv'):
            current_df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith(('.xls', '.xlsx')):
            current_df = pd.read_excel(io.BytesIO(contents))
        else:
            # Try CSV default, if fail then error
             current_df = pd.read_csv(io.BytesIO(contents))

        # Preprocessing
        current_df = clean_columns(current_df)
        
        # Mimic the cleaning steps from the script
        current_df = current_df.drop("Unnamed: 0", axis=1, errors='ignore')
        current_df = current_df.drop("Unnamed: 17", axis=1, errors='ignore')
        current_df = current_df.dropna()
        
        state.set_df(current_df)
        
        return {
            "message": "File uploaded and processed successfully",
            "columns": list(current_df.columns),
            "rows": len(current_df)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

@router.get("/download")
def download_csv():
    df = state.get_df()
    if df is None:
        raise HTTPException(status_code=400, detail="No data available")
    
    # Save to a temporary file
    temp_file = "download_data.csv"
    df.to_csv(temp_file, index=False)
    return FileResponse(temp_file, filename="data.csv", media_type='text/csv')

from database import db
from models import QueryRequest, User, ChatLog
from fastapi.concurrency import run_in_threadpool

# ... (imports remain)

@router.get("/users")
async def list_users():
    try:
        users_cursor = db.get_db()["ai.Users"].find()
        users = await users_cursor.to_list(length=100)
        # Convert ObjectId to str if needed, for now just return basic list handles
        for user in users:
            user["_id"] = str(user["_id"])
        return users
    except Exception as e:
        print(f"[!] Database Error in /users: {e}")
        # Return empty list or 503 depending on preference, but for frontend stability often empty list is safer if not critical
        return []

@router.post("/ask")
async def ask_endpoint(request: QueryRequest):
    df = state.get_df()
    if df is None:
        raise HTTPException(status_code=400, detail="No data loaded. Please upload a CSV file first.")

    question = request.question
    print(f"\n[?] Question: {question}")

    vis_keywords = ["visualize", "visualise", "visualisation", "plot", "chart", "graph", "histogram", "scatter", "bar", "pie"]
    if any(keyword in question.lower() for keyword in vis_keywords):
        request.visualize = True


    schema = build_column_schema(df)
    try:
        plan = await run_in_threadpool(llm_build_plan, question, schema)
        print("[!] Plan:", plan)

        result = await run_in_threadpool(run_plan, plan, df)
        
        if result.get("analysis") == "clean" and "new_df" in result:
            state.set_df(result.pop("new_df"))

    
        response = build_api_response(result, request.visualize)
      
    
        rephrased_answer = response["answer"]
        
        if request.visualize and "charts" in response:
             rephrased_answer += "\n\nYou can see a visualization of the chart [here](/chat/visualize)."
             
        if result.get("analysis") == "clean":
             rephrased_answer += f"\n\n[Download Cleaned Data]({config.API_BASE_URL}/download)"

        response["answer"] = rephrased_answer

        
        if not request.visualize:
            response.pop("charts", None)

        print("[=] Answer:", rephrased_answer)

        try:
            chat_log = ChatLog(
                user_id=request.user_id,
                question=question,
                answer=rephrased_answer
            )
            await db.get_db()["chats"].insert_one(chat_log.dict())
            print("Chat saved to DB")
        except Exception as db_e:
            print(f"Failed to save chat to DB: {db_e}")

        return response

    except ValueError as e:
        print(f"[!] Validation/LLM Error: {e}")
        return {
            "answer": f"I couldn't process your request: {str(e)}. Please try rephrasing or asking about existing columns."
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
