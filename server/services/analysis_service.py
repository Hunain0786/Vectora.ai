import pandas as pd
import re
from sklearn.linear_model import LinearRegression
from services.data_service import resolve_sales_column, clean_dataframe, advanced_clean_dataframe

def get_numeric_features(df, target):
    numeric_cols = df.select_dtypes(include=["number"]).columns.tolist()
    return [c for c in numeric_cols if c != target]


def train_sales_model(df, target):
    features = get_numeric_features(df, target)

    X = df[features].fillna(0)
    y = df[target]

    model = LinearRegression()
    model.fit(X, y)

    return features, model.coef_, model


def simulate_changes(df, target, model, features):
    base = df[features].mean().values.reshape(1, -1)
    base_pred = model.predict(base)[0]

    impacts = []

    for i, feat in enumerate(features):
        modified = base.copy()
        modified[0][i] *= 1.10  # +10%

        new_pred = model.predict(modified)[0]

        impacts.append({
            "feature": feat,
            "delta_sales": round(new_pred - base_pred, 2)
        })

    return sorted(impacts, key=lambda x: x["delta_sales"], reverse=True)


def sales_diagnostics(df, plan):
    target = plan.get("target")

    if target not in df.columns:
        target = resolve_sales_column(df)

    features, coefs, model = train_sales_model(df, target)
    impacts = simulate_changes(df, target, model, features)

    return {
        "analysis": "sales_diagnostics",
        "target": target,
        "top_drivers": [
            {"feature": f, "coefficient": round(c, 3)}
            for f, c in zip(features, coefs)
        ],
        "recommended_actions": impacts[:3]
    }

def extract_product_id(question):
    match = re.search(r"\bP\d+\b", question.upper())
    return match.group(0) if match else None

def build_feature_impact_chart(result):
    target = result.get("target", "metric")

    return {
        "type": "bar",
        "intent": "feature_impact",
        "metric": target,
        "description": {
            "what": "change_in_metric",
            "based_on": "historical_data",
            "unit": "delta"
        },
        "data": [
            {
                "label": a["feature"],
                "value": a["delta_sales"]
            }
            for a in result["recommended_actions"]
        ]
    }

def user_requested_chart(question):
    keywords = [
        "chart",
        "graph",
        "plot",
        "visualize",
        "visualisation",
        "show me",
        "diagram"
    ]

    q = question.lower()
    return any(k in q for k in keywords)

def execute_clean(df, p):
    problem_type = p.get("problem_type", "general")
    target = p.get("target")
    
    new_df, report = advanced_clean_dataframe(df, target_col=target, problem_type=problem_type)
    
    return {
        "analysis": "clean",
        "new_df": new_df,
        "report": report
    }

OPERATORS = {
    "argmax": lambda df, p: {
        "analysis": "argmax",
        "entity": df.loc[df[p["metric"]].idxmax()][p["group_by"]],
        "value": float(df[p["metric"]].max())
    },

    "argmin": lambda df, p: {
        "analysis": "argmin",
        "entity": df.loc[df[p["metric"]].idxmin()][p["group_by"]],
        "value": float(df[p["metric"]].min())
    },

    "lookup": lambda df, p: {
        "analysis": "lookup",
        "entity": list(p["filter"].values())[0],
        "value": float(
            df[
                df[list(p["filter"].keys())[0]] ==
                list(p["filter"].values())[0]
            ][p["metric"]].iloc[0]
        )
    },

    "sales_diagnostics": sales_diagnostics,

    "chat": lambda df, p: {
        "analysis": "chat",
        "reply": p["reply"]
    },

    "sum": lambda df, p: {
        "analysis": "sum",
        "metric": p["metric"],
        "value": float(df[p["metric"]].sum())
    },

    "mean": lambda df, p: {
        "analysis": "mean",
        "metric": p["metric"],
        "value": float(df[p["metric"]].mean())
    },

    "count": lambda df, p: {
        "analysis": "count",
        "metric": p["metric"],
        "value": int(df[p["metric"]].count())
    },

    "clean": execute_clean
}

def validate_plan(plan, df):
    if "operator" not in plan:
        raise ValueError("Plan missing operator")

    if plan["operator"] not in OPERATORS:
        raise ValueError(f"Unsupported operator: {plan['operator']}")

    if "metric" in plan and plan["metric"] not in df.columns:
        raise ValueError(f"Column '{plan['metric']}' not found in dataset")

    if "group_by" in plan and plan["group_by"] not in df.columns:
        raise ValueError(f"Column '{plan['group_by']}' not found in dataset")

    if "filter" in plan:
        col = list(plan["filter"].keys())[0]
        if col not in df.columns:
            raise ValueError(f"Column '{col}' not found in dataset")


def run_plan(plan, df):
    try:
        validate_plan(plan, df)
    except ValueError as e:
        return {
            "analysis": "chat",
            "reply": f"I couldn't process that request because of a data issue: {str(e)}. Please try asking about columns that exist in your file."
        }
    
    return OPERATORS[plan["operator"]](df, plan)

def explain_result(result):
    if result["analysis"] == "sales_diagnostics":
        intro = (
            "I've analyzed your historical data patterns. "
            "Here are the most effective actions you can take to improve sales:"
        )

        bullets = []
        for a in result["recommended_actions"]:
            bullets.append(
                f"- Increasing **{a['feature']}** typically leads to an increase of "
                f"**{a['delta_sales']} units** in sales."
            )

        closing = (
            "These insights are based on correlations found in your dataset."
        )

        return "\n".join([intro, "", *bullets, "", closing])

    if result["analysis"] == "argmax":
        return (
            f"The highest value is found in **{result['entity']}**, "
            f"with a score of **{result['value']}**."
        )

    if result["analysis"] == "argmin":
        return (
            f"The lowest value is in **{result['entity']}**, "
            f"coming in at **{result['value']}**."
        )

    if result["analysis"] == "lookup":
        return (
            f"Looking at the data, the value for **{result['entity']}** is **{result['value']}**."
        )

    if result["analysis"] == "chat":
        return result["reply"]
        
    if result["analysis"] == "sum":
        return f"The total **{result['metric']}** amounts to **{result['value']:,.2f}**."

    if result["analysis"] == "mean":
        return f"The average **{result['metric']}** is approximately **{result['value']:,.2f}**."

    if result["analysis"] == "count":
        return f"I found a total count of **{result['value']}** for **{result['metric']}**."

    if result["analysis"] == "clean":
        if "report" in result:
             return explain_data_cleaning(result["report"])
        return "I've cleaned the data for you. I removed duplicates and handled missing values."

    return "I’m unable to generate a clear explanation for this result."

def explain_data_cleaning(report):
    lines = []

    # Missing values
    if report.get("missing_values") == "handled":
        lines.append(
            "I detected some missing values and handled them. "
            "I filled numerical columns with their mean values, "
            "and categorical columns with the most frequent category."
        )

    # Duplicates
    duplicates = report.get("duplicates_removed", 0)
    if duplicates > 0:
        lines.append(
            f"I found {duplicates} duplicate rows and removed them to keep your analysis accurate."
        )
    else:
        lines.append(
            "It looks like there were no duplicate records in the dataset."
        )

    # Class imbalance
    imbalance = report.get("class_imbalance")

    if isinstance(imbalance, dict):
        majority = max(imbalance["distribution"], key=imbalance["distribution"].get)
        ratio = imbalance["distribution"][majority]

        lines.append(
            f"I noticed a strong class imbalance in the target variable, where the majority class made up {int(ratio * 100)}% "
            "of the data."
        )

        lines.append(
            "To correct this, I balanced the dataset using controlled undersampling."
        )

        lines.append(
            f"The dataset now has {imbalance['after_rows']} rows (previously {imbalance['before_rows']})."
        )

    elif imbalance == "not detected":
        lines.append(
            "I didn't detect any significant class imbalance, so I kept the original distribution."
        )

    # Problem-specific actions (NLP)
    if "problem_type_actions" in report and report["problem_type_actions"]:
        lines.append("For Sentiment Analysis prep:")
        for action in report["problem_type_actions"]:
            lines.append(f"- {action}")

    # Class distribution (Multi-class)
    if "class_distribution" in report:
        lines.append("Class Distribution Analysis:")
        dist = report["class_distribution"]
        for cls, ratio in dist.items():
            lines.append(f"- Class '{cls}': {int(ratio*100)}%")

    return "\n\n".join(lines)

def build_api_response(result, visualize_requested):
    response = {
        "answer": explain_result(result)
    }

    if (
        result["analysis"] == "sales_diagnostics"
        and visualize_requested
    ):
        response["charts"] = [
            build_feature_impact_chart(result)
        ]

    return response
