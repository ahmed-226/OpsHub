# URL Shortener

## Project Overview

This project, developed by Team OpsHub, aims to build a functional, containerized URL shortener webservice with full observability using modern DevOps tools.

The URL shortener allows users to:
- Shorten long URLs into concise links
- Store URL mappings in a PostgreSQL database
- Redirect users from short URLs to their original destinations

To ensure reliability and performance monitoring, the service is instrumented to expose custom metrics. These metrics are collected by Prometheus and visualized using Grafana. The entire stack is orchestrated using Kubernetes, making it scalable and resilient. It can be run locally using a cluster like Minikube or Docker Desktop Kubernetes.

Drive : https://docs.google.com/spreadsheets/d/1XycL96p0Q6XzlMcqmLNFLoG6f6s_KYVLmsklgZRa-ec/edit?usp=drivesdk 

## Project Members

- **[Mahmoud Hesham](https://github.com/mahmoudhesham-gad)** - Backend & Monitoring
- **[Ahmed Abdelaal](https://github.com/ahmed-226)** - Backend & Monitoring
- **[Youssef Salah](https://github.com/youssefsalah9)** - Kubernetes Deployment
- **[Ali Sayed](https://github.com/alisayed-20)** - Kubernetes Deployment
- **[Bishoy Ayman](https://github.com/Bishoy77)** - Monitoring
- **[Abdelrahman Ahmed](https://github.com/AbdoViper23)** - Kubernetes Deployment

## Technologies Used

- **Backend Framework**: Node.js (Express)
- **Database**: PostgreSQL
- **Containerization & Orchestration**: Docker, Kubernetes
- **Monitoring**:
  - Prometheus (metrics collection)
  - Grafana (metrics visualization)
  - Custom Metrics: Application-level metrics for usage and performance

## Features

- URL shortening and redirection
- Persistent storage of URL mappings in PostgreSQL
- RESTful API built with Express.js
- Kubernetes-native architecture for scalability and high availability
- Export of custom metrics from the webservice
- Prometheus scraping metrics from the service
- Grafana dashboard displaying:
  - Number of URLs created
  - Number of redirects
  - Request latencies
  - Service health

## Architecture Overview

The application is deployed on a Kubernetes cluster, with each component running as a distinct set of resources:

### Express.js Webservice (Deployment)
Runs in Pods managed by a Deployment, allowing for easy scaling and updates. A Service exposes the application within the cluster so Prometheus can scrape its `/metrics` endpoint.

### PostgreSQL Database (StatefulSet)
Deployed as a StatefulSet to ensure stable network identity and persistent storage using PersistentVolumeClaims (PVCs).

### Prometheus (Deployment)
Deployed with a ConfigMap that defines scrape targets, automatically discovering and collecting metrics from the webservice pods.

### Grafana (Deployment)
Visualizes metrics collected by Prometheus. Its data source is configured to point to the Prometheus service.

### Services & Networking
Kubernetes Services provide stable endpoints to access each component (app, database, Prometheus, Grafana).

## Running the Project

### Prerequisites

- Docker
- kubectl command-line tool
- A local Kubernetes cluster (e.g., Minikube, Docker Desktop Kubernetes)

### Steps to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/url-shortener.git
   cd url-shortener
   ```

2. **Build the Docker Image**:
   Build the image for the webservice and load it into your local cluster's registry (for Minikube, use `minikube image load <image-name>`):
   ```bash
   docker build -t url-shortener-app:latest .
   minikube image load url-shortener-app:latest
   ```

3. **Apply the Kubernetes Manifests**:
   Apply all the configuration files located in the `kubernetes/` directory. This will create all the necessary Deployments, StatefulSets, Services, and ConfigMaps.
   ```bash
   kubectl apply -f kubernetes/
   ```

4. **Verify the Pods are running**:
   ```bash
   kubectl get pods
   ```
   Wait until all pods show `Running` status.

## Access the Services

To access the services from your local machine, use `kubectl port-forward`. Run each command in a separate terminal.

### URL Shortener API:
```bash
kubectl port-forward svc/url-shortener-service 3000:3000
```
Now accessible at: http://localhost:3000

### Prometheus UI:
```bash
kubectl port-forward svc/prometheus-service 9090:9090
```
Now accessible at: http://localhost:9090

### Grafana Dashboard:
```bash
kubectl port-forward svc/grafana-service 3001:3000
```
Now accessible at: http://localhost:3001

#### Grafana Login
- **Username**: admin
- **Password**: admin

## API Endpoints

| Method | Endpoint     | Description                |
|--------|-------------|----------------------------|
| POST   | /shorten    | Create a short URL         |
| GET    | /:shortCode | Redirect to original URL   |
| GET    | /metrics    | Expose Prometheus metrics  |

## Monitoring Metrics

The Express.js application exposes the following metrics:

- `http_requests_total` – Number of requests received
- `url_shorten_requests_total` – Total shorten URL requests
- `url_redirect_requests_total` – Total redirect requests
- `http_request_duration_seconds` – Duration of HTTP requests

These metrics are available at the `/metrics` endpoint and are automatically scraped by Prometheus.
