# HTW Tutor Platform

A full-stack web application connecting HTW University of Applied Sciences
students with private tutors for their courses. Students can browse tutors,
view profiles, and book sessions; tutors can create a profile with a photo
and their subject/course specialty.

Every service in this project uses a **free tier that doesn't require a
credit card**, so it can be run and hosted at no cost.

## Pages (frontend navigation)

1. **Home** — landing page introducing the platform
2. **Login**
3. **Register**
4. **Tutors** — browse/filter tutor listings
5. **Tutor Profile** — tutor detail + booking form
6. **My Bookings (Dashboard)** — a student's booked sessions
7. **Become a Tutor** — create a tutor profile with an image upload

## Architecture

| Service | Responsibility | Free-tier home |
|---|---|---|
| `frontend` | React single-page app | Netlify (static hosting) |
| `backend/auth-service` | Registration, login, JWT issuing | Render.com free web service |
| `backend/tutoring-service` | Tutor listings, image upload, bookings | Render.com free web service |
| `frontend/netlify/functions/booking-notification.js` | Serverless function that logs booking confirmations | Netlify Functions |
| MongoDB | Data storage for both services | MongoDB Atlas free (M0) cluster |
| Tutor images | Cloud image storage | Cloudinary free tier |

```
frontend (React, Netlify) ──REST──> auth-service (Express + MongoDB Atlas)
       │
       └──REST──> tutoring-service (Express + MongoDB Atlas)
                        │
                        ├──> Cloudinary (tutor images)
                        └──> Netlify Function (booking-notification, serverless)
```

## Requirement checklist

- **Microservice architecture**: `auth-service` and `tutoring-service` are
  independently deployable services, each with its own API.
- **Frontend + backend**: React frontend in `frontend/`, two Express
  backends in `backend/`.
- **Cloud-based image storage**: tutor profile images are uploaded to
  **Cloudinary** via `backend/tutoring-service/utils/imageStorage.js`.
- **REST API**: all frontend–backend communication goes through JSON REST
  endpoints (`/api/auth/...`, `/api/tutors/...`, `/api/bookings/...`).
- **Docker**: every backend service has its own `Dockerfile`;
  `docker-compose.yml` runs the whole stack locally.
- **Container orchestration**: Kubernetes manifests in `k8s/` deploy every
  service — run them on **Minikube** (free, on your own machine) to
  demonstrate orchestration without any cluster hosting cost.
- **Hosting**: frontend on **Netlify**, backend services on **Render.com**
  (see [Deployment](#deployment)) — both free tiers.
- **Serverless component**: `frontend/netlify/functions/booking-notification.js`
  is a **Netlify Function** that sends booking confirmations.

## Running locally

Requirements: Docker and Docker Compose.

```bash
cp backend/auth-service/.env.example backend/auth-service/.env
cp backend/tutoring-service/.env.example backend/tutoring-service/.env
cp frontend/.env.example frontend/.env

docker compose up --build
```

- Frontend: http://localhost:3000
- Auth service: http://localhost:4001/health
- Tutoring service: http://localhost:4002/health

Without Cloudinary credentials, tutor profiles can still be created — the
image upload step is simply skipped and a placeholder image is shown.

## Deployment (all free tiers)

### 1. MongoDB Atlas (database)
Create a free account at mongodb.com/cloud/atlas and deploy the free
**M0** shared cluster. Create a database user and allow access from
anywhere (0.0.0.0/0) for simplicity. Copy the connection string and use it
as `MONGO_URI` for both backend services (use two different database names
in the URI, e.g. `.../htw_auth` and `.../htw_tutoring`).

### 2. Cloudinary (image storage)
Sign up for free at cloudinary.com — no credit card required. From your
dashboard copy the **Cloud Name**, **API Key**, and **API Secret** into
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` for
the tutoring-service.

### 3. Backend services on Render.com
Create a free account at render.com. For each of `backend/auth-service`
and `backend/tutoring-service`:
1. "New Web Service" → connect your Git repo (or use "Public Git
   Repository" with the folder path).
2. Set the root directory to `backend/auth-service` (or
   `backend/tutoring-service`).
3. Build command: `npm install`. Start command: `npm start`.
4. Add the environment variables from that service's `.env.example`.
5. Select the **Free** instance type.

Render gives you a public HTTPS URL for each service — note both down.

*Free-tier note: Render's free web services spin down after periods of
inactivity and take a few seconds to wake back up on the next request.
That's expected and fine for a class project demo.*

### 4. Frontend + serverless function on Netlify
Create a free account at netlify.com.
1. "Add new site" → connect your Git repo.
2. Base directory: `frontend`. Build command: `npm run build`. Publish
   directory: `frontend/build`. Netlify auto-detects `netlify/functions`
   from `netlify.toml` and deploys `booking-notification.js` as a function.
3. Set environment variables `REACT_APP_AUTH_API_URL` and
   `REACT_APP_TUTORING_API_URL` to your two Render service URLs (with
   `/api` appended), then redeploy.

Your Netlify Function will be live at
`https://<your-site>.netlify.app/.netlify/functions/booking-notification`.
Set that as `NOTIFICATION_FUNCTION_URL` on the tutoring-service (in Render)
and redeploy it.

### 5. Kubernetes orchestration demo (Minikube, local, free)
To satisfy the container orchestration requirement without any cloud
cluster cost:

```bash
minikube start
minikube addons enable ingress   # optional, only if using k8s/ingress.yaml

# Build images locally and load them into Minikube instead of pushing
# to a registry:
eval $(minikube docker-env)
docker build -t htw-auth-service:latest backend/auth-service
docker build -t htw-tutoring-service:latest backend/tutoring-service
docker build -t htw-frontend:latest frontend

# Update the image fields in k8s/*.yaml to just "htw-auth-service:latest"
# etc. (no registry prefix) and set imagePullPolicy: Never, then apply:
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mongo.yaml
kubectl apply -f k8s/auth-service.yaml
kubectl apply -f k8s/tutoring-service.yaml
kubectl apply -f k8s/frontend.yaml

minikube service frontend -n htw-tutor   # opens the app in your browser
```

This runs the full microservice stack under real Kubernetes orchestration
on your own machine, at zero cost — separate from the live Netlify/Render
hosted link used for grading/demoing the public URL.

*Alternative: if your student account gives you free credits (e.g. GitHub
Student Pack, or a cloud provider's trial), you can instead push images to
Docker Hub's free public repositories and run these same manifests on a
real cluster (AKS, GKE Autopilot free tier, etc.) — just swap the image
references back to `<your-dockerhub-username>/...`.*

## Tech stack

- **Frontend**: React, React Router
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB Atlas (free M0 cluster)
- **Auth**: JWT + bcrypt
- **Image storage**: Cloudinary (free tier)
- **Serverless**: Netlify Functions
- **Containers**: Docker, Docker Compose
- **Orchestration**: Kubernetes (Minikube for local/free demonstration)
- **Hosting**: Netlify (frontend + function), Render.com (backend services)
