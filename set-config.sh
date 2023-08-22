#!/bin/sh

# Replace placeholders with environment variables
sed -i -e 's,DEFAULT_API_URL,'"$REACT_APP_API_URL"',g' /usr/share/nginx/html/config.js

# Now, run the main application command
exec "$@"
