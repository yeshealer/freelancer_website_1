FROM nginx:latest
RUN apt-get update && apt-get install -y vim
COPY build /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/