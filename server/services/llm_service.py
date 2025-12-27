import re
import json
from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def safe_json_parse(text):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # fallback: extract first {...} block
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        return json.loads(match.group())

    raise ValueError("LLM did not return valid JSON")

def llm_build_plan(question, schema):
    prompt = f"""
You are a data analyst.

Dataset columns:
{schema["columns"]}

Sample rows:
{schema["sample_rows"]}

User question:
"{question}"

You MUST return VALID JSON ONLY.

Allowed operators:
- argmax
- argmin
- lookup
- sales_diagnostics
- chat
- sum
- mean
- count
- clean

Rules:
- If the user asks for advice, recommendations, or how to increase sales,
  you MUST use operator "sales_diagnostics".
- If the user explicitly asks to "visualize", "chart", "plot", or "show a graph",
  you MUST use operator "sales_diagnostics" (treating the visualization target as the target variable).
- If the user greets or asks a general question not related to data, use operator "chat".
- If the user asks to clean the data, remove duplicates, or handle missing values, use operator "clean".
- If the user specifies a cleaning type (e.g., "clean for sentiment analysis", "clean for classification"), add "problem_type".
  
JSON formats:
{{ "operator": "argmax", "metric": "...", "group_by": "..." }}
{{ "operator": "argmin", "metric": "...", "group_by": "..." }}
{{ "operator": "lookup", "metric": "...", "filter": {{ "Product ID": "P105" }} }}
{{ "operator": "sales_diagnostics", "target": "Sales" }}
{{ "operator": "chat", "reply": "Hello! How can I help you analyze your data today?" }}
{{ "operator": "sum", "metric": "Revenue" }}
{{ "operator": "mean", "metric": "Profit" }}
{{ "operator": "count", "metric": "Product ID" }}
{{ "operator": "clean" }}
{{ "operator": "clean", "problem_type": "sentiment_analysis" }}
{{ "operator": "clean", "problem_type": "binary_classification", "target": "Churn" }}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    return safe_json_parse(response.choices[0].message.content)


    def llm_rephrase_explanation(text):
        prompt = f"""
    You are a friendly, intelligent AI assistant speaking to a real human.

    Your goal is to make the response sound:
    - natural
    - conversational
    - confident but not formal
    - like a smart colleague explaining something

    Strict rules:
    - Do NOT sound like a report, FAQ, or documentation
    - Avoid bullet points unless absolutely necessary
    - Vary sentence length naturally
    - Use soft transitions (e.g. "What stands out here is...", "One interesting thing is...")
    - Do NOT repeat phrases like "the data shows" again and again
    - Do NOT add new facts
    - Do NOT change any numbers
    - Do NOT give advice unless already present

    Rewrite the text below following these rules.

    Text:
    {text}
    """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )

        return response.choices[0].message.content.strip()
