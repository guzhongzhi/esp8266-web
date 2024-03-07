FROM node:18 as builder
WORKDIR /app
COPY . ./
RUN /bin/sh -c "npm install --registry=http://registry.npmmirror.com"
RUN /bin/sh -c "npm run build --registry=http://registry.npmmirror.com"

#---
FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html


