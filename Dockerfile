FROM node:18 as builder
WORKDIR /app
COPY . ./
RUN /bin/bash -c "npm install"
RUN /bin/bash -c "npm run build"

---

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html


