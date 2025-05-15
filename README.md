# Calculator Microservice App (Task 9.1)

This is a **calculator microservice web application** that performs basic arithmetic operations and stores calculation logs in **MongoDB**. The app is containerized using Docker and deployed within a **Kubernetes cluster**. MongoDB is configured with persistent storage and secrets for secure credential management.

## 🛠 Project Structure

calculator-app/
├── k8s/
│ ├── calculator-deployment.yaml # Kubernetes deployment for calculator app
│ ├── mongo-deployment.yaml # Kubernetes deployment for MongoDB
│ ├── mongo-pv-pvc.yaml # Persistent Volume & Persistent Volume Claim for MongoDB
│ ├── mongo-secret.yaml # Kubernetes secret for MongoDB credentials
│ ├── service.yaml # Kubernetes services for app and database
├── node_modules/ # Node.js dependencies
├── public/
│ ├── index.html # Frontend HTML interface
│ ├── scripts.js # Frontend JavaScript logic
│ ├── styles.css # Styling for the calculator interface
├── Dockerfile # Docker image setup for the app
├── init-user.js # MongoDB initialization script
├── package-lock.json # Lock file for npm dependencies
├── package.json # Node.js project metadata and dependencies
├── README.md # Project documentation
├── server.js # Express server backend logic


## Features

- Simple calculator for addition, subtraction, multiplication, and division
- Web frontend built with HTML, CSS, and JS
- Backend built with **Node.js** and **Express**
- Logs all calculations in **MongoDB**
- Dockerized for containerized deployment
- Fully deployed using Kubernetes
- Includes Persistent Volumes and Kubernetes Secrets

---

## Prerequisites

Before running or deploying the app, ensure the following tools are installed:

- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Kubernetes](https://kubernetes.io/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [MongoDB](https://www.mongodb.com/)

---

## Running Locally with Docker

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/calculator-app.git
   cd calculator-app

2. Build and run the Docker container:
    docker build -t calculator-app .
    docker run -p 3001:3001 calculator-app

3. Access the app at:
    http://localhost:3001

-------------------------------------------------------------------------

Deploying to Kubernetes

1. Make sure your Kubernetes cluster is running.

2. Apply the Kubernetes configurations:
    kubectl apply -f k8s/mongo-secret.yaml
    kubectl apply -f k8s/mongo-pv-pvc.yaml
    kubectl apply -f k8s/mongo-deployment.yaml
    kubectl apply -f k8s/calculator-deployment.yaml
    kubectl apply -f k8s/service.yaml

Notes
    - The MongoDB user is initialized using init-user.js during deployment.
    - Calculation history is stored in MongoDB collections for reference or analytics.
    - Kubernetes secret is used to hide sensitive database credentials from public view.

License
This project is for educational purposes as part of Task 9.1.

Author
Cher Supakovit : 📜 License
This project is for educational purposes as part of Task 9.1.

👨‍💻 Author
Cher Supakovit
Research Master's Student @ Deakin University
GitHub: Cher24
