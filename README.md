# OpsHub - Monitoring a Containerized URL Shortener Webservice

## Project Overview

This project, developed by **Team OpsHub**, aims to build a functional, containerized URL shortener webservice with full observability using modern DevOps tools.

The URL shortener allows users to:

- Shorten long URLs into concise links
- Store URL mappings in a PostgreSQL database
- Redirect users from short URLs to their original destinations

To ensure reliability and performance monitoring, the service is instrumented to expose custom metrics. These metrics are collected by **Prometheus** and visualized using **Grafana**. The entire stack runs locally using **Docker** and **Docker Compose**, making it easy to deploy and manage.

---

## Project Members

- Mahmoud Hesham  
- Abdelrahman Ahmed  
- Youssef Salah  
- Bishoy Ayman  
- Ahmed Abdelaal  
- Ali Sayed

---

## Technologies Used

- **Backend Framework:** Node.js (Express)
- **Database:** PostgreSQL
- **Containerization:** Docker, Docker Compose
- **Monitoring:**
  - Prometheus (metrics collection)
  - Grafana (metrics visualization)
- **Custom Metrics:** Application-level metrics for usage and performance

---

## Features

- URL shortening and redirection
- Persistent storage of URL mappings in PostgreSQL
- RESTful API built with Express.js
- Dockerized architecture for consistent local development
- Export of custom metrics from the webservice
- Prometheus scraping metrics from the service
- Grafana dashboard displaying:
  - Number of URLs created
  - Number of redirects
  - Request latencies
  - Service health

---

## Architecture Overview

1. **Express.js Webservice**
   - Exposes endpoints for creating and resolving short URLs
   - Exports custom metrics in Prometheus format

2. **PostgreSQL Database**
   - Stores the original URLs and their shortened versions

3. **Prometheus**
   - Periodically scrapes metrics from the Express service

4. **Grafana**
   - Visualizes collected metrics through custom dashboards

---

## Running the Project

### Prerequisites

- Docker
- Docker Compose

### Steps to Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/url-shortener-ops-monitoring.git
   cd url-shortener-ops-monitoring

## Access the Services

- **URL Shortener API:** [http://localhost:3000](http://localhost:3000)  
- **Prometheus UI:** [http://localhost:9090](http://localhost:9090)  
- **Grafana Dashboard:** [http://localhost:3001](http://localhost:3001)

---

## Grafana Login (Optional)

- **Username:** `admin`  
- **Password:** `admin`

---

## API Endpoints

| Method | Endpoint       | Description                |
|--------|----------------|----------------------------|
| POST   | `/shorten`     | Create a short URL         |
| GET    | `/:shortCode`  | Redirect to original URL   |
| GET    | `/metrics`     | Expose Prometheus metrics  |

---

## Monitoring Metrics

The Express.js application exposes the following metrics:

- `http_requests_total` – Number of requests received  
- `url_shorten_requests_total` – Total shorten URL requests  
- `url_redirect_requests_total` – Total redirect requests  
- `http_request_duration_seconds` – Duration of HTTP requests  

These metrics are available at the `/metrics` endpoint and are automatically scraped by Prometheus.

