import tensorflow as tf
from tensorflow.keras import layers, models, backend as K

class VAE(models.Model):
    """
    A Variational Autoencoder (VAE) for anomaly detection.

    This model is trained on 'normal' data and can be used to detect anomalies
    by identifying data points with high reconstruction error.
    """
    def __init__(self, original_dim, latent_dim=2, intermediate_dim=64, name="vae", **kwargs):
        super(VAE, self).__init__(name=name, **kwargs)

        self.original_dim = original_dim
        self.latent_dim = latent_dim
        self.intermediate_dim = intermediate_dim

        # Encoder
        encoder_inputs = layers.Input(shape=(original_dim,))
        h = layers.Dense(intermediate_dim, activation='relu')(encoder_inputs)
        self.z_mean = layers.Dense(latent_dim, name="z_mean")(h)
        self.z_log_var = layers.Dense(latent_dim, name="z_log_var")(h)
        self.encoder = models.Model(encoder_inputs, [self.z_mean, self.z_log_var], name="encoder")

        # Decoder
        latent_inputs = layers.Input(shape=(latent_dim,))
        h_decoded = layers.Dense(intermediate_dim, activation='relu')(latent_inputs)
        outputs = layers.Dense(original_dim, activation='sigmoid')(h_decoded)
        self.decoder = models.Model(latent_inputs, outputs, name="decoder")

    def call(self, inputs):
        z_mean, z_log_var = self.encoder(inputs)
        z = self._sampling([z_mean, z_log_var])
        reconstructed = self.decoder(z)
        
        # Add KL divergence loss
        kl_loss = -0.5 * tf.reduce_mean(z_log_var - tf.square(z_mean) - tf.exp(z_log_var) + 1)
        self.add_loss(kl_loss)
        
        return reconstructed

    def _sampling(self, args):
        """Reparameterization trick by sampling from an isotropic unit Gaussian."""
        z_mean, z_log_var = args
        batch = tf.shape(z_mean)[0]
        dim = tf.shape(z_mean)[1]
        epsilon = K.random_normal(shape=(batch, dim))
        return z_mean + tf.exp(0.5 * z_log_var) * epsilon

# Example Usage
if __name__ == '__main__':
    import numpy as np

    # 1. Generate some dummy 'normal' data
    original_dimension = 10
    train_data = np.random.rand(1000, original_dimension).astype('float32')

    # 2. Instantiate and compile the VAE model
    vae = VAE(original_dim=original_dimension, latent_dim=2, intermediate_dim=8)
    vae.compile(optimizer='adam', loss='mse')

    # 3. Train the model
    print("Training the VAE on dummy 'normal' data...")
    vae.fit(train_data, train_data, epochs=5, batch_size=32, verbose=1)
    print("VAE training complete.")

    # 4. Use the model to reconstruct data and check for anomalies
    # In a real scenario, a high reconstruction error would indicate an anomaly.
    test_data_normal = np.random.rand(1, original_dimension).astype('float32')
    test_data_anomaly = np.random.rand(1, original_dimension).astype('float32') * 2.0 # Simulate an anomaly

    reconstructed_normal = vae.predict(test_data_normal)
    reconstructed_anomaly = vae.predict(test_data_anomaly)

    mse_normal = np.mean(np.power(test_data_normal - reconstructed_normal, 2), axis=1)
    mse_anomaly = np.mean(np.power(test_data_anomaly - reconstructed_anomaly, 2), axis=1)

    print(f"\nReconstruction error for 'normal' data point: {mse_normal[0]:.4f}")
    print(f"Reconstruction error for 'anomalous' data point: {mse_anomaly[0]:.4f}")

    if mse_anomaly > mse_normal:
        print("\nThe model correctly identified the anomaly (higher reconstruction error).")
    else:
        print("\nThe model did not distinguish the anomaly in this simple test.")
