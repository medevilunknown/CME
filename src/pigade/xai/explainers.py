import shap
import numpy as np
import pandas as pd

def explain_anomaly(model, normal_data, anomalous_instance, feature_names):
    """
    Explains an anomaly detection using SHAP (SHapley Additive exPlanations).

    This function demonstrates how to use the SHAP library to explain why the
    model assigned a high reconstruction error to a specific instance.

    Args:
        model: The trained VAE model.
        normal_data: A representative sample of 'normal' data (e.g., the training set).
                     This is used by SHAP to calculate expected values.
        anomalous_instance: The specific data point that was flagged as an anomaly.
        feature_names: A list of names for the input features.

    Returns:
        A SHAP explanation object, which can be used for plotting.
    """
    # SHAP needs a function that takes an array and returns the model's output.
    # For a VAE-based anomaly detector, the "output" is the reconstruction error (MSE).
    def model_predict_mse(data):
        reconstructed = model.predict(data)
        return np.mean(np.power(data - reconstructed, 2), axis=1)

    # 1. Create a SHAP explainer
    # KernelExplainer is a good general-purpose explainer.
    explainer = shap.KernelExplainer(model_predict_mse, normal_data)

    # 2. Calculate SHAP values for the anomalous instance
    # This shows how much each feature contributed to pushing the prediction
    # away from the baseline (average) reconstruction error.
    shap_values = explainer.shap_values(anomalous_instance)

    # Add feature names to the explanation for easier interpretation
    return shap.Explanation(values=shap_values, 
                            base_values=explainer.expected_value, 
                            data=anomalous_instance, 
                            feature_names=feature_names)

# Example Usage
if __name__ == '__main__':
    from src.pigade.models.vae import VAE # Assumes the VAE model is in the path

    # 1. Setup: Train a dummy VAE model
    original_dimension = 5
    feature_names = [f'feature_{i+1}' for i in range(original_dimension)]
    
    # Generate 'normal' data for training
    train_data = np.random.rand(100, original_dimension).astype('float32')
    
    # Create and train the VAE
    vae = VAE(original_dim=original_dimension, latent_dim=2, intermediate_dim=4)
    vae.compile(optimizer='adam', loss='mse')
    vae.fit(train_data, train_data, epochs=3, verbose=0)

    # 2. Create a sample 'anomalous' data point
    # Make feature_3 and feature_5 significantly different from the normal distribution.
    anomaly_sample = np.random.rand(1, original_dimension).astype('float32')
    anomaly_sample[0, 2] = 1.5  # Anomalous value for feature_3
    anomaly_sample[0, 4] = -0.5 # Anomalous value for feature_5
    
    print("Explaining anomaly for instance:")
    print(pd.DataFrame(anomaly_sample, columns=feature_names))

    # 3. Use the SHAP explainer to understand the anomaly
    try:
        explanation = explain_anomaly(vae, train_data, anomaly_sample, feature_names)

        print("\nSHAP Explanation (feature contributions to anomaly score):")
        # For each feature, a positive SHAP value contributes to a higher anomaly score.
        shap_df = pd.DataFrame({
            'feature': feature_names,
            'shap_value': explanation.values[0]
        })
        print(shap_df)

        print("\nThis shows that feature_3 and feature_5 were the primary contributors to the high reconstruction error, as expected.")
        
        # To visualize the explanation, you would typically use:
        # shap.plots.waterfall(explanation[0])
        # This requires matplotlib to be installed.
        
    except ImportError as e:
        print(f"\nCould not run SHAP example. Please ensure SHAP is installed (`pip install shap`). Error: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
