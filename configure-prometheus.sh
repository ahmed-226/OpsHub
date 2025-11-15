#!/bin/bash
set -e

# Define variables for the service, namespace, and port
POD_LABEL="app=url-shortener"
POD_NAMESPACE="default"
NAMESPACE="prometheus"
JOB_NAME="node-app"
SCRAPE_INTERVAL="5s"
METRICS_PATH="/metrics"

# Define the ConfigMap name and target
CONFIGMAP_NAME="prometheus-server"

# Get the current ConfigMap and extract the prometheus.yml section
minikube kubectl -- get configmap "$CONFIGMAP_NAME" --namespace "$NAMESPACE" -o json |
  jq -r '.data["prometheus.yml"]' >prometheus.yml

# Check if the target already exists in the prometheus.yml
if grep -q "job_name: '$JOB_NAME'" prometheus.yml; then
  echo "Target for $JOB_NAME already exists in prometheus.yml, no changes made."
else
  echo "Target not found, adding to prometheus.yml."

  # Create a temporary file with the new job config (proper indentation)
  cat >new_job.txt <<EOF
- job_name: '$JOB_NAME'
  scrape_interval: $SCRAPE_INTERVAL
  metrics_path: '$METRICS_PATH'
  kubernetes_sd_configs:
    - role: pod
      namespaces:
        names:
          - $POD_NAMESPACE
      selectors:
        - role: "pod"
          label: "$POD_LABEL"

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
