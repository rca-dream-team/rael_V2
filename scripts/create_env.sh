#!/bin/bash
RAEL_DATABASE_URL="mongodb+srv://rael-admin:v2SVcBGGy497yc2C@rael.spa7zeo.mongodb.net/rael"
SANITY_TOKEN=skOtKw6BPL5Jlqewtbot5JbPn6E41OaBcbrdXWB4SFkbx3dU9cQVZChvQWqsqUbeVpJ154qPsZOSNJXYQKKqBml7o5dWjkzlWh3GrXJ28f8j7oiuF7axS2svjB8O4T0bFU2ACy5zB0x3AbfnCvwN3Oiob7Od8JPjpsJi8U0DNIAeE89dDz85
NEXT_PUBLIC_TOKEN=skOtKw6BPL5Jlqewtbot5JbPn6E41OaBcbrdXWB4SFkbx3dU9cQVZChvQWqsqUbeVpJ154qPsZOSNJXYQKKqBml7o5dWjkzlWh3GrXJ28f8j7oiuF7axS2svjB8O4T0bFU2ACy5zB0x3AbfnCvwN3Oiob7Od8JPjpsJi8U0DNIAeE89dDz85
NEXT_PUBLIC_MIS_API_URL=http://5.252.53.111:6543/api/v1
JWT_SECRET=mfwmknjvjfpijm727jnmkka_%^*!@dwedwsxx_
# Specify the content to be written to the .env file
ENV_CONTENT="SANITY_TOKEN=$SANITY_TOKEN\nNEXT_PUBLIC_TOKEN=$NEXT_PUBLIC_TOKEN\nNEXT_PUBLIC_MIS_API_URL=$NEXT_PUBLIC_MIS_API_URL\nJWT_SECRET=$JWT_SECRET\nRAEL_DATABASE_URL=$RAEL_DATABASE_URL"

# Check if .env file exists
if [ -f .env ]; then
    # If the file exists, override its contents
    echo -e "$ENV_CONTENT" > .env
    echo "Existing .env file updated."
else
    # If the file doesn't exist, create it and write the content
    echo -e "$ENV_CONTENT" > .env
    echo ".env file created."
fi
