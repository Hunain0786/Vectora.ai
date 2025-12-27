import pandas as pd
import numpy as np

def clean_columns(df):
    df = df.copy()
    df.columns = (
        df.columns
        .str.replace("\n", " ", regex=False)
        .str.replace("/", " ", regex=False)
        .str.replace("-", " ", regex=False)
        .str.strip()
    )
    return df

def clean_missing_values(df):
    df = df.copy()

    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            df[col] = df[col].fillna(df[col].mean())
        else:
            mode = df[col].mode()
            if not mode.empty:
                df[col] = df[col].fillna(mode[0])

    return df

def remove_duplicates(df):
    return df.drop_duplicates()

def clean_dataframe(df):
    df = clean_missing_values(df)
    df = remove_duplicates(df)
    return df

def detect_class_imbalance(df, target_col, threshold=0.75):
    if target_col not in df.columns:
        return None

    value_counts = df[target_col].value_counts(normalize=True)

    if len(value_counts) != 2:
        return None  # not binary

    majority_class = value_counts.idxmax()
    majority_ratio = value_counts.max()

    if majority_ratio >= threshold:
        return {
            "imbalanced": True,
            "majority_class": majority_class,
            "majority_ratio": round(majority_ratio, 2),
            "distribution": value_counts.to_dict()
        }

    return {
        "imbalanced": False,
        "distribution": value_counts.to_dict()
    }

def balance_binary_classes(df, target_col):
    counts = df[target_col].value_counts()

    if len(counts) != 2:
        return df

    minority_class = counts.idxmin()
    minority_count = counts.min()

    df_min = df[df[target_col] == minority_class]
    df_maj = df[df[target_col] != minority_class].sample(
        n=minority_count,
        random_state=42
    )

    balanced_df = pd.concat([df_min, df_maj]).sample(frac=1, random_state=42)
    return balanced_df


def clean_text(text):
    if not isinstance(text, str):
        return ""
    import re
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def clean_for_nlp(df):
    report_items = []
    for col in df.columns:
        if df[col].dtype == 'object':
            mean_len = df[col].astype(str).map(len).mean()
            if mean_len > 10:
                df[col] = df[col].apply(clean_text)
                report_items.append(f"Cleaned text in column '{col}' (lowercased, removed punctuation).")
    return df, report_items

def advanced_clean_dataframe(df, target_col=None, problem_type="general"):
    report = {}
    
    df = clean_missing_values(df)
    report["missing_values"] = "handled"

    before = len(df)
    df = remove_duplicates(df)
    report["duplicates_removed"] = before - len(df)
    
    report["problem_type_actions"] = []

    if problem_type == "sentiment_analysis":
        df, nlp_report = clean_for_nlp(df)
        report["problem_type_actions"].extend(nlp_report)
        
    elif problem_type == "binary_classification":
        if target_col:
            imbalance = detect_class_imbalance(df, target_col)
            if imbalance and imbalance["imbalanced"]:
                before_rows = len(df)
                df = balance_binary_classes(df, target_col)
                report["class_imbalance"] = {
                    "action": "undersampling",
                    "before_rows": before_rows,
                    "after_rows": len(df),
                    "distribution": imbalance["distribution"]
                }
            else:
                 report["class_imbalance"] = "not detected"
                 
    elif problem_type == "classification":
     
         if target_col:
             val_counts = df[target_col].value_counts(normalize=True).to_dict()
             report["class_distribution"] = val_counts

    return df, report

def resolve_sales_column(df):
    candidates = []

    for col in df.columns:
        name = col.lower()
        if "sale" in name or "unit" in name or "revenue" in name:
            if pd.api.types.is_numeric_dtype(df[col]):
                candidates.append(col)

    if not candidates:
        raise ValueError("No suitable sales column found")

    return candidates[0]

def build_column_schema(df):
    return {
        "columns": list(df.columns),
        "sample_rows": df.head(3).to_dict(orient="records")
    }
