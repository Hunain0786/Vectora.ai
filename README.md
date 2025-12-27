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

## 5. System Architecture Diagram

```mermaid
graph TD
    %% Styling
    classDef client fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef server fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef db fill:#fff3e0,stroke:#ef6c00,stroke-width:2px;
    classDef llm fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;

    subgraph "Client Side (Next.js)"
        User((User))
        LocalStorage[("LocalStorage (Cache)")]:::client
        subgraph Pages
            LandingPage[Landing Page]:::client
            ChatPage[Chat Interface]:::client
            CleanPage[Cleaning Studio]:::client
        end
    end

    subgraph "Server Side (FastAPI)"
        ServerState[("In-Memory DataFrame")]:::server
        
        subgraph Services
            LLMService[LLM Service]:::llm
            DataService[Data Service]:::server
            AnalysisService[Analysis Service]:::server
        end
        
        Router[API Router]:::server
    end

    %% Upload Flow
    User -->|Uploads CSV| LandingPage
    LandingPage -->|1. Cache File| LocalStorage
    LandingPage -->|2. POST /upload| Router
    Router -->|Set Data| ServerState

    %% Session Restore
    ChatPage -- On Load --> LocalStorage
    LocalStorage -->|Restore Session (Background Upload)| Router

    %% Chat Flow
    User -->|Asks Question| ChatPage
    ChatPage -->|POST /ask| Router
    Router -->|Get Schema| ServerState
    Router -->|Build Plan| LLMService
    LLMService -- Returns JSON Plan --> Router
    Router -->|Execute Plan| AnalysisService
    AnalysisService -->|Read Data| ServerState
    
    AnalysisService -- "Visualisation?" --> Charts[Generate Charts]:::server
    AnalysisService -- "Analysis?" --> Stats[calc stats/lookup]:::server
    
    AnalysisService -->|Result| Router
    Router -->|Response| ChatPage

    %% Cleaning Flow
    User -->|Configures| CleanPage
    CleanPage -->|POST /clean/advanced| Router
    Router -->|Problem Type + Target| DataService
    
    DataService -->|Check Mode| ModeSwitch{Problem Type}
    
    ModeSwitch -->|General| BaseClean[Missing Values & Dups]:::server
    ModeSwitch -->|Sentiment Analysis| NLP[Text Normalization]:::server
    ModeSwitch -->|Binary Class| Imbalance[Undersampling]:::server
    
    BaseClean --> Report[Generate Report]:::server
    NLP --> Report
    Imbalance --> Report
    
    Report -->|JSON Summary| CleanPage
```
