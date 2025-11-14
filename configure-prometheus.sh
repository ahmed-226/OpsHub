#!/bin/bash
set -e

# Define variables for the service, namespace, and port
SERVICE_NAME="url-shortener-service"
SERVICE_NAMESPACE="default"
NAMESPACE="prometheus"
PORT="3000"

# Define the ConfigMap name and target
CONFIGMAP_NAME="prometheus-server"

# Get the current ConfigMap and extract the prometheus.yml section
minikube kubectl -- get configmap "$CONFIGMAP_NAME" --namespace "$NAMESPACE" -o json |
  jq -r '.data["prometheus.yml"]' >prometheus.yml

# Check if the target already exists in the prometheus.yml
if grep -q "$SERVICE_NAME.$SERVICE_NAMESPACE.svc.cluster.local:$PORT" prometheus.yml; then
  echo "Target for $SERVICE_NAME already exists in prometheus.yml, no changes made."
else
  echo "Target not found, adding to prometheus.yml."
  TARGET_LINE="  - targets: [\"$SERVICE_NAME.$SERVICE_NAMESPACE.svc.cluster.local:$PORT\"]"

  # Create a temporary file with the new job config (proper indentation)
  cat >new_job.txt <<EOF
- job_name: node
  static_configs:
$TARGET_LINE
EOF

  # Insert the file content after the line containing scrape_configs:
  sed -i '/scrape_configs:/r new_job.txt' prometheus.yml

  # Clean up
  rm new_job.txt

  # Patch the ConfigMap instead of applying (avoids the warning)
  minikube kubectl -- create configmap "$CONFIGMAP_NAME" \
    --namespace "$NAMESPACE" \
    --from-file=prometheus.yml \
    --dry-run=client -o yaml |
    minikube kubectl -- replace -f -

  echo "ConfigMap updated successfully."
fi

# Clean up
rm prometheus.yml
