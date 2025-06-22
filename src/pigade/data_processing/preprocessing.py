import pandas as pd
from sklearn.preprocessing import MinMaxScaler

def handle_missing_values(df: pd.DataFrame, method: str = 'interpolate', order: int = 1) -> pd.DataFrame:
    """
    Handles missing values in a DataFrame.

    Args:
        df: The input DataFrame.
        method: The method to use for handling missing values.
                'interpolate' for linear interpolation, 'ffill' for forward fill,
                'bfill' for backward fill.
        order: For 'interpolate' method, specifies the order of the spline
               interpolation if needed.

    Returns:
        The DataFrame with missing values handled.
    """
    if method == 'interpolate':
        return df.interpolate(method='time', order=order)
    elif method == 'ffill':
        return df.ffill()
    elif method == 'bfill':
        return df.bfill()
    else:
        return df.dropna()

def resample_time_series(df: pd.DataFrame, rule: str = '1T') -> pd.DataFrame:
    """
    Resamples a time-series DataFrame to a different frequency.

    Args:
        df: The input DataFrame with a DatetimeIndex.
        rule: The new time frequency (e.g., '1T' for 1 minute, '5S' for 5 seconds).

    Returns:
        The resampled DataFrame, with values aggregated by their mean.
    """
    return df.resample(rule).mean()

def normalize_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalizes numerical features in a DataFrame to the [0, 1] range.

    Args:
        df: The input DataFrame.

    Returns:
        The DataFrame with numerical features normalized.
    """
    scaler = MinMaxScaler()
    # Create a copy to avoid SettingWithCopyWarning
    df_normalized = df.copy()
    
    # Select only numeric columns to scale
    numeric_cols = df_normalized.select_dtypes(include=['number']).columns
    df_normalized[numeric_cols] = scaler.fit_transform(df_normalized[numeric_cols])
    
    return df_normalized

# Example Usage
if __name__ == '__main__':
    # Create a sample DataFrame with missing values and a time index
    time_index = pd.to_datetime(pd.date_range(start='2023-01-01', periods=10, freq='30S'))
    data = {
        'feature1': [1, 2, None, 4, 5, 6, None, 8, 9, 10],
        'feature2': [10, 20, 30, 40, 50, 60, 70, 80, None, 100]
    }
    sample_df = pd.DataFrame(data, index=time_index)
    print("Original DataFrame:")
    print(sample_df)

    # 1. Handle missing values
    df_filled = handle_missing_values(sample_df)
    print("\n1. DataFrame after handling missing values:")
    print(df_filled)

    # 2. Resample the data
    df_resampled = resample_time_series(df_filled, rule='1T')
    print("\n2. DataFrame after resampling to 1-minute frequency:")
    print(df_resampled)

    # 3. Normalize the features
    df_normalized = normalize_features(df_resampled)
    print("\n3. DataFrame after normalizing features:")
    print(df_normalized)
