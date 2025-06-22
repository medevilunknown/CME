import tensorflow as tf
import pandas as pd

def calculate_physics_loss(reconstructed_data: tf.Tensor, feature_names: list) -> tf.Tensor:
    """
    Calculates a physics-based loss term for the reconstructed data.

    This is a placeholder function to demonstrate how to incorporate physical
    constraints into the model's loss function. This example enforces a
    plausible range for the alpha-to-proton density ratio.

    Args:
        reconstructed_data: The output of the VAE's decoder, as a TensorFlow tensor.
        feature_names: A list of feature names corresponding to the columns
                       of the reconstructed_data.

    Returns:
        A TensorFlow tensor representing the physics-based loss.
    """
    # Create a DataFrame from the tensor to easily access columns by name
    # This is for readability; for performance, direct tensor manipulation is better.
    df = pd.DataFrame(reconstructed_data.numpy(), columns=feature_names)

    # --- Example Constraint: Alpha-to-Proton Ratio ---
    # In normal slow solar wind, the alpha-to-proton ratio (n_alpha / n_p) is
    # typically below 0.08. We can add a penalty if it exceeds this.
    loss = 0.0
    if 'alpha_density' in df.columns and 'proton_density' in df.columns:
        alpha_proton_ratio = df['alpha_density'] / (df['proton_density'] + 1e-6) # Add epsilon for stability
        
        # Define the physically plausible maximum ratio for "normal" wind
        max_ratio = 0.08
        
        # Penalize values that are above the maximum ratio
        ratio_loss = tf.reduce_mean(tf.maximum(0.0, alpha_proton_ratio - max_ratio))
        loss += ratio_loss

    # --- Future constraints can be added here ---
    # e.g., constraints on temperature anisotropy, plasma beta, etc.

    return tf.constant(loss, dtype=tf.float32)

# Example Usage
if __name__ == '__main__':
    # Define feature names as they would appear in the data
    features = ['proton_density', 'alpha_density', 'proton_velocity']

    # 1. Create a batch of 'normal' reconstructed data (as a tf.Tensor)
    # Here, the alpha/proton ratio is low (0.05), so the loss should be zero.
    normal_data = tf.constant([
        [10.0, 0.5, 300.0],
        [12.0, 0.6, 310.0]
    ], dtype=tf.float32)

    # 2. Create a batch of 'anomalous' reconstructed data
    # Here, the alpha/proton ratio is high (0.1), so the loss should be non-zero.
    anomalous_data = tf.constant([
        [10.0, 1.0, 400.0], # Ratio = 0.1
        [12.0, 1.8, 410.0]  # Ratio = 0.15
    ], dtype=tf.float32)

    # Calculate physics loss for both
    normal_loss = calculate_physics_loss(normal_data, features)
    anomalous_loss = calculate_physics_loss(anomalous_data, features)

    print(f"Physics loss for 'normal' data: {normal_loss.numpy():.4f}")
    print(f"Physics loss for 'anomalous' data: {anomalous_loss.numpy():.4f}")

    if anomalous_loss > normal_loss:
        print("\nThe physics loss function correctly penalized the anomalous data.")
    else:
        print("\nThe physics loss function did not work as expected.")
