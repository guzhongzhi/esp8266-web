FROM node:18 as builder
WORKDIR /app
COPY . ./
RUN /bin/sh -c "npm install"
RUN /bin/sh -c "npm run build"

#---
FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html


