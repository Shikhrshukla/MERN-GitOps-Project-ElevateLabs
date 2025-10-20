
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
