
# GitOpsify Three-Tier MERN Deployment

**SUMMARY:** 
A MERN (MongoDB, Express, React, Node) sample application delivered with a GitOps workflow: Docker images built in GitHub Actions, images pushed to Docker Hub, and a Helm chart reconciled by Argo CD on a local kind Kubernetes cluster.

---

## How to set this project up locally - step by step (commands only)

> These are the commands I used during development. Replace placeholders (like `<your-docker-user>`, `<repo>`, `<chart-name>`) with your values.

### Prerequisite Installations
- Git
- Docker (or Docker Desktop)
- kind (Kubernetes in Docker)
- kubectl
- helm
- OpenSSL (for self-signed certs)
- GitHub account + Docker Hub account (for CI to push to)
- Optional: Argo CD CLI if you want to work with Argo locally

#### ArgoCD Server Installation
```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
sleep 100
argocd admin initial-password -n argocd
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Access the ArgoCD Server at ```localhost:8080```, Login as 'admin' username and given password


### 1. Clone repository
```bash
git clone https://github.com/Shikhrshukla/MERN-GitOps-Project-ElevateLabs.git
cd MERN-GitOps-Project-ElevateLabs
```

### 2. Build and run local containers (quick smoke test)
```bash
# Build frontend image locally
docker build -t <your-docker-user>/mern-frontend:latest -f Ui/Dockerfile ./Ui

# Build backend image locally
docker build -t <your-docker-user>/mern-backend:latest -f server/Dockerfile ./server

# Create a docker network
docker network create -d bridge mern

# Run mongo, backend, frontend (manual runs for quick checks)
docker run -d --name mongo -p 27017:27017 --network mern mongo:latest
docker run -d --name server -p 5000:5000 --network mern --link mongo <your-docker-user>/mern-backend:latest
docker run -d --name frontend -p 3000:3000 --network mern <your-docker-user>/mern-frontend:latest
```

Or use `docker-compose` if a compose file is present:
```bash
docker-compose up --build
```

### 3. Create a local kind cluster (1 control-plane + 2 workers)
```bash
# create cluster with optional extra port mappings (recommended if you want host:80/443)
cat <<'EOF' | kind create cluster --config=-
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
- role: worker
- role: worker
EOF

kind create cluster --config kind-config.yaml --name mycluter
```

If you prefer not to recreate the cluster, you can still use NodePort or port-forward (see troubleshooting below).

### 4. Install ingress controller (nginx)
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl get pods -n ingress-nginx
```

### 5. Deploy the app (Helm chart)
```bash
# from the repo root where the helm chart lives
helm upgrade --install mern-app ./helm/mern-helm-chart --namespace default --create-namespace
```

### 6. Create TLS secret (self-signed)  - certificate files remain local
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
 -keyout tls.key -out tls.crt \
 -subj "/CN=shikhar.sample.com/O=Local"

kubectl create secret tls shikhar-sample-com-tls \
 --cert=tls.crt \
 --key=tls.key \
 -n default
```

### 7. Map a host for local testing
```bash
# add to /etc/hosts (needs sudo)
sudo -- sh -c "echo '127.0.0.1 shikhar.sample.com' >> /etc/hosts"
```

### 8. Expose ingress locally (one of these options)

**Option A  - port-forward HTTPS:**
```bash
kubectl -n ingress-nginx port-forward svc/ingress-nginx-controller 8090:443
# then browse https://shikhar.sample.com:8090
```

**Option B  - port-forward HTTP:**
```bash
kubectl -n ingress-nginx port-forward svc/ingress-nginx-controller 8090:80
# then browse http://shikhar.sample.com:8090
```

**Option C  - NodePort**
```bash
kubectl -n ingress-nginx patch svc ingress-nginx-controller -p '{"spec": {"type": "NodePort"}}'
kubectl -n ingress-nginx get svc ingress-nginx-controller
# Note the NodePort assigned; then browse http://<node-ip>:<nodePort> or map domain to node-ip
```

### 9. Trigger CI/CD (push changes)
```bash
git add .
git commit -m "my change"
git push origin main
# GitHub Actions will run the pipeline, build images, push to Docker Hub, and update Helm values (if configured).
```

### 10. Argo CD (GitOps)
- Install Argo CD into the cluster or use the existing installation.
- Create an Argo CD application that points to your Helm chart (repo + path).
- Sync the app via Argo CD UI or CLI.

---

## What this project is and the real‑world problems it solves

This project is an end‑to‑end demonstration of how to build, package, and continuously deliver a modern web application using industry-standard tools:

- **MERN stack** for a typical three‑tier application (frontend, backend, database).
- **Docker** to package services so they run the same everywhere.
- **kind** (Kubernetes IN Docker) for local cluster testing.
- **GitHub Actions** for CI (build, security scan, image publish).
- **Helm** for templated Kubernetes manifests.
- **Argo CD** for GitOps-driven continuous delivery.

**Problems solved in real life:**
- Reproducible builds and environment parity across developer machines and clusters.
- Automated CI that builds and scans artifacts, improving security and repeatability.
- GitOps: declarative, auditable deployments  - changes happen when commits change the desired state.
- Clear separation of concerns (three-tier): frontend UI, backend API, and a persistent datastore.
- Secure serving (TLS) using Kubernetes secrets (certs kept out of Git).
- Local development story that mirrors production flow closely without needing cloud resources.

---

## High-level workflow (what I did in this project)

1. **Local development**
  - Used a MERN app and verified basic functionality after running it locally.
  - Installed dependencies and iterated on UI and API code.

2. **Containerization**
  - Wrote `Dockerfile`s for the Frontend(Ui) and Backend(server).
  - Built images locally to validate container behavior.

3. **Compose the full-stack for local testing**
  - Created a `docker-compose.yml` to spin up frontend, backend, and MongoDB together and verify inter-container networking.

4. **Kubernetes testing (local)**
  - Switched to a local kind Kubernetes cluster.
  - Created Deployment/Service/Ingress manifests and grouped them into a Helm chart.
  - Installed an NGINX ingress controller and validated routing.
  - After all clear clarifications I had proceed to write the pipeline.

5. **CI pipeline**
  - Wrote a GitHub Actions workflow to:
   - Checkout code and install dependencies.
   - Run CodeQL for static analysis.
   - Build and push Docker images (tagged with commit SHA).
   - Update Helm chart values with the image tag (commit back to repo).
  - Secured Docker credentials with GitHub secrets.

6. **GitOps CD**
  - Installed Argo CD on the kind cluster and pointed it at the repository/Helm chart.
  - Argo CD observes the chart and reconciles Kubernetes resources as Helm values change.

7. **TLS for local testing**
  - Generated a self-signed certificate for the test domain (`shikhar.sample.com`) using OpenSSL.
  - Created a Kubernetes `tls` secret directly in the cluster (certificate files were not pushed to Git).
  - Updated Ingress to reference the TLS secret so the app can be tested over HTTPS.

---

## What I learned (short list)

- Use production builds for frontend in containers (multi-stage Dockerfile + nginx) rather than running dev servers in containers. [Learned but not Implemented]
- In Kind, `LoadBalancer` services don’t work the same as cloud providers; prefer NodePort or `extraPortMappings` for local access.
- Never commit private keys or large binaries to the git history.
- Use `github.sha` or `github.run_number` for stable image tags; avoid numeric fields that may get scientific notation.
- For live reload in containers, prefer polling or increase inotify limit on host instead of trying to change it from inside the container.

---

## Troubleshooting (most common failure points & fixes)

- **Ingress returns 404** 
 - Check `kubectl describe ingress <name>` and verify backend service and port match exactly the Service port.
 - Ensure `kubectl get endpoints <service>` shows pod endpoints.
- **App works with port-forward but not root domain**
 - Make sure `/etc/hosts` maps the domain to the correct IP (`127.0.0.1` if you port-forward, or the node IP if using NodePort).
 - If using port-forward, use the forwarded port in the URL (`:8080` vs `:80`).
- **TLS errors (browser warns)** 
 - Self-signed certs are expected to warn. Import the cert into your OS trust store or use cert-manager + Let’s Encrypt for trusted certs.
- **Vite "EMFILE: too many open files"** 
 - Use `CHOKIDAR_USEPOLLING=true`, increase `fs.inotify.max_user_watches` on host, or serve built assets with nginx.
- **Git push rejected due to large files** 
 - Remove big files from history with BFG or git filter-branch and add them to `.gitignore`. Use Git LFS if you need to store big binaries.
- **CI workflow cannot push changes back to repo** 
 - Ensure the action has `permissions: contents: write` and uses a token that allows pushing (use a personal access token stored as a secret if needed).

---

## Security notes and best practices

- **Never commit private keys or TLS certs** to a public repo. Create Kubernetes secrets directly or use sealed secrets / SOPS.
- Use `github.sha` (shortened if needed) for image tags to avoid collisions/scientific-notation issues.
- Rotate any tokens or credentials that might have been exposed during testing.

---

## Quick recovery checklist (first 6 high-priority fixes)
1. Convert frontend Dockerfile to a production multi-stage build and serve static files with nginx. 
2. Fix the GitHub Actions tagging step to use `github.sha` or `github.run_number` (not `github.run_id`). 
3. Remove large binaries from git history and add `.gitignore`. 
4. Make the ingress controller reachable locally (NodePort or kind extraPortMappings). 
5. Stop running Vite dev server in production images  - use built files.
6. Store TLS certs as Kubernetes secrets or use SealedSecrets/cert-manager; never push certs to the repo.

---

## Screenshots

### Local Build Output (Frontend)
<img width="1919" height="957" alt="1" src="https://github.com/user-attachments/assets/78de63cf-e82a-46cb-aa61-2d00c1227776" />

### Local Build Output (Backend) 
<img width="1919" height="957" alt="2" src="https://github.com/user-attachments/assets/e279b631-d1cd-450a-b6cf-1bc5d9b919ff" />

### Docker Compose Up Output 
<img width="1920" height="1002" alt="3" src="https://github.com/user-attachments/assets/b5a7dabc-7bb0-437b-9212-8561c406dee3" />

### kind Cluster Creation Output 
<img width="1919" height="961" alt="4" src="https://github.com/user-attachments/assets/1d945da2-0d40-4d2e-9c72-21993f0d1c4e" />

### kubectl get all -n default
<img width="1919" height="960" alt="5" src="https://github.com/user-attachments/assets/876b19bf-7854-4408-bb9b-2656293fd3ad" />

### Ingress Controller Pod Logs 
<img width="1920" height="954" alt="6a" src="https://github.com/user-attachments/assets/b5c6280d-43f0-4be4-b57e-f4e5df15b87e" />
<img width="1920" height="954" alt="6b" src="https://github.com/user-attachments/assets/c2559fe5-72ef-4301-96ec-22fc5a804d3a" />

### Frontend Pod Logs
<img width="1919" height="957" alt="7" src="https://github.com/user-attachments/assets/72061c25-0380-4c17-9713-ce71993532b1" />

### Backend Pod Logs
<img width="1919" height="957" alt="8" src="https://github.com/user-attachments/assets/6754f8c2-d3c7-41ee-a772-eca745a5d21a" />

### MongoDB Pod Logs
<img width="1919" height="957" alt="9" src="https://github.com/user-attachments/assets/20c9351d-30e7-47cd-aea6-3631b1671862" />

### Argo CD Components and Port Forwarding
<img width="1919" height="961" alt="10a" src="https://github.com/user-attachments/assets/85d8935d-a100-4b31-a4ab-761601b79f4d" />
<img width="1919" height="367" alt="10b" src="https://github.com/user-attachments/assets/bc873dc3-6e57-45c7-95b4-105bc3fcc19c" />

### Argo CD Application Overview (UI)
<img width="1919" height="965" alt="11a" src="https://github.com/user-attachments/assets/c3a6fc3d-7942-4751-a5d8-be3e26fc1da2" />
<img width="1919" height="965" alt="11b" src="https://github.com/user-attachments/assets/e7e3add7-7e65-42b5-8df7-15de79589023" />
<img width="1919" height="965" alt="11c" src="https://github.com/user-attachments/assets/9d1ae2dd-7d36-4131-a46e-28bff3a571bf" />
<img width="1919" height="965" alt="11d" src="https://github.com/user-attachments/assets/afb3113d-57eb-4f8b-aea8-df31fb7b801d" />

### Argo CD Sync History / Events
<img width="1919" height="957" alt="12" src="https://github.com/user-attachments/assets/83db6408-a3b1-4199-9bd9-55776c53d2f9" />

### Github Repository
<img width="1919" height="965" alt="13" src="https://github.com/user-attachments/assets/39e82ca2-1633-4984-8a02-53b3eb429373" />

### GitHub Actions Workflow Run (Summary)
<img width="1919" height="965" alt="14" src="https://github.com/user-attachments/assets/2c7c2035-08a7-49ca-b84c-1ff47679f8e7" />

### Docker Hub Repository (Image Tags)
<img width="1919" height="965" alt="15a" src="https://github.com/user-attachments/assets/babaf2f9-2d5e-4649-9e1e-98408b5d9820" />
<img width="1919" height="965" alt="15b" src="https://github.com/user-attachments/assets/6b0328ed-2015-4b89-9889-a8d6f66eb007" />

### Ingress Controller Installed on Cluster
<img width="1919" height="965" alt="16" src="https://github.com/user-attachments/assets/14e59a67-2252-4163-bca7-acb920a9793f" />

### Ingress Controller Port-forwarding
<img width="1919" height="964" alt="17" src="https://github.com/user-attachments/assets/f06f0857-53a7-4af2-b8be-b617169c28ff" />

### HTTPS Acces (Browser Warning)
<img width="1919" height="952" alt="18a" src="https://github.com/user-attachments/assets/2770acc7-fd23-4b5c-8438-91b0a2ce4912" />
<img width="1915" height="362" alt="18b" src="https://github.com/user-attachments/assets/87337f56-56bd-419b-b0d9-88eb5ca0100e" />
<img width="1920" height="559" alt="18c" src="https://github.com/user-attachments/assets/afd653aa-8ae5-4263-b1c3-fa8d6a2a35ac" />

### TLS Secret in Kubernetes (kubectl get secret)
<img width="1140" height="403" alt="19a" src="https://github.com/user-attachments/assets/8366eb52-28ac-4635-996d-fb6c286db87f" />
<img width="1920" height="1049" alt="19b" src="https://github.com/user-attachments/assets/34871f41-bda3-4d0d-89f5-56b414dd18d2" />

### Application/Website Work
<img width="1919" height="1045" alt="20a" src="https://github.com/user-attachments/assets/8b5a7db6-6b79-4b2f-ac82-695c0e043c26" />
<img width="1919" height="1045" alt="20b" src="https://github.com/user-attachments/assets/af5f09fb-710f-4eaa-806f-9e7e9857f598" />
<img width="1919" height="1045" alt="20c" src="https://github.com/user-attachments/assets/732b39d4-73c8-4d21-ba79-8d88306cfe42" />

---















