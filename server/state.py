import pandas as pd

# Global state for the dataframe
df = None

def set_df(new_df):
    global df
    df = new_df

def get_df():
    global df
    return df
