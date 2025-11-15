#!/bin/bash
set -e

echo "========================================"
echo "Setting up Prometheus and Grafana"
echo "========================================"

# Define namespace
NAMESPACE="prometheus"

# Create namespace if it doesn't exist
echo "Creating namespace: $NAMESPACE"
minikube kubectl -- create namespace "$NAMESPACE" --dry-run=client -o yaml | minikube kubectl -- apply -f -

# Add Helm repositories
echo "Adding Helm repositories..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install Prometheus
echo "Installing Prometheus..."
if helm list -n "$NAMESPACE" | grep -q "prometheus"; then
  echo "Prometheus is already installed. Skipping installation."
else
  helm install prometheus prometheus-community/prometheus \
    --namespace "$NAMESPACE" \
    --set server.persistentVolume.enabled=false \
    --set alertmanager.persistentVolume.enabled=false
  echo "Prometheus installed successfully."
fi

# Wait for Prometheus to be ready
echo "Waiting for Prometheus to be ready..."
minikube kubectl -- wait --for=condition=ready pod -l app.kubernetes.io/name=prometheus -n "$NAMESPACE" --timeout=300s

# Install Grafana
echo "Installing Grafana..."
if helm list -n "$NAMESPACE" | grep -q "grafana"; then
  echo "Grafana is already installed. Skipping installation."
else
  helm install grafana grafana/grafana \
    --namespace "$NAMESPACE" \
    --set persistence.enabled=false \
    --set adminPassword=admin
  echo "Grafana installed successfully."
fi

# Wait for Grafana to be ready
echo "Waiting for Grafana to be ready..."
minikube kubectl -- wait --for=condition=ready pod -l app.kubernetes.io/name=grafana -n "$NAMESPACE" --timeout=300s

echo "========================================"
echo "Configuring Prometheus"
echo "========================================"

# Run the configuration script
if [ -f "./configure-prometheus.sh" ]; then
  chmod +x ./configure-prometheus.sh
  ./configure-prometheus.sh
  echo "Prometheus configured successfully."
else
  echo "Warning: configure-prometheus.sh not found. Skipping configuration."
fi

# Restart Prometheus to pick up new configuration
echo "Restarting Prometheus server..."
minikube kubectl -- rollout restart deployment prometheus-server -n "$NAMESPACE"
minikube kubectl -- rollout status deployment prometheus-server -n "$NAMESPACE" --timeout=300s

echo "========================================"
echo "Exposing Services"
echo "========================================"

# Get Grafana admin password
GRAFANA_PASSWORD=$(minikube kubectl -- get secret --namespace "$NAMESPACE" grafana -o jsonpath="{.data.admin-password}" | base64 --decode)

echo ""
echo "========================================"
echo "Service Information"
echo "========================================"
echo "Prometheus Server: prometheus-server.$NAMESPACE.svc.cluster.local:80"
echo "Grafana: grafana.$NAMESPACE.svc.cluster.local:80"
echo ""
echo "Grafana Credentials:"
echo "  Username: admin"
echo "  Password: $GRAFANA_PASSWORD"
echo "========================================"
echo "Setup complete! 🎉"
