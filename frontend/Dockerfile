# Use Nginx Alpine image
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static files
COPY public/ /usr/share/nginx/html/

# Create nginx user and set permissions
RUN addgroup -g 1001 -S nginx
RUN adduser -S nginx -u 1001

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
