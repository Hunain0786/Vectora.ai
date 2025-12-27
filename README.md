# Vectora.ai Workflow Documentation

This document outlines the core workflows and feature implementations for the Vectora.ai application, focusing on Data Analysis, Visualization, and Advanced Data Cleaning.

## 1. Authentication & Session Management
- **Flow**: Users sign in via `/signin`.
- **Persistence**: 
  - Login state matches the `username` stored in `localStorage`.
  - The application automatically checks this state on load. 
  - If the user is not logged in, they are redirected or prompted to sign in.
  - *Fix Implemented*: Removed auto-logout timers to ensure sessions remain active as long as the user wants.

## 2. Data Upload & Persistence
- **Flow**: Users upload a CSV file on the Landing Page (`/`).
- **Caching**:
  - Before uploading to the server, the file (if < 5MB) is saved to the browser's `localStorage` (`cached_csv`).
  - This ensures that if the page is refreshed or the browser closed, the analysis session can be restored immediately without re-uploading.
- **Server State**: The server stores the dataframe in an in-memory global state (`server/state.py`).

## 3. Intelligent Data Analysis (Chat)
- **Flow**: Users interact with their data via natural language on the Chat Page (`/chat`).
- **Process**:
  1. **Intent Detection**: The system detects if the user wants to *visualize*, *clean*, OR *analyze* data based on keywords (e.g., "plot", "chart", "clean").
  2. **Plan Generation**: An LLM (GPT-4o) converts the textual question into a structured JSON execution plan.
  3. **Execution**: The plan is executed against the Pandas DataFrame.
  4. **Response**: The system generates a natural language explanation of the results.
- **Visualization**:
  - If the user asks to "visualize" or toggles the visualization checkbox, the system prioritizes `sales_diagnostics` or chart-compatible operators.
  - Interactive charts are generated and displayed in the chat stream.

## 4. Advanced Data Cleaning Studio
- **Flow**: Users access the dedicated cleaning interface at `/clean`.
- **Modes**:
  The system supports problem-specific cleaning pipelines:
  - **General**: Standard handling of missing values (mean/mode imputation) and duplicate removal.
  - **Sentiment Analysis (NLP)**: Optimized for text data. Automatically detects text columns, performs lowercasing, punctuation removal, and whitespace normalization.
  - **Binary Classification**: Detects target class imbalance. If found (e.g., 90% vs 10%), it automatically performs undersampling to balance the dataset for better model training.
  - **Classification**: Analyzes and reports class distributions for multi-class problems.
- **Reporting**:
  - Instead of a black box, the system returns a detailed "Analyst Report" summarizing exactly what actions were taken (e.g., "Removed 15 duplicates", "Balanced dataset from 1000 to 400 rows").
