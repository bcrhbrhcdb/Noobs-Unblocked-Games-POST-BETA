#!/bin/bash

# Set the remote repository URL
REMOTE_REPO="https://github.com/bcrhbrhcdb/Noobs-Unblocked-Games-POST-BETA.git"

# Fetch the latest changes from the remote repository
git fetch origin

# Get the current branch name
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Reset the current branch to match the remote branch
git reset --hard origin/$current_branch