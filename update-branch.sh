#!/bin/bash

# Set the remote repository URL
REMOTE_REPO="origin"

# Fetch the latest changes from the remote repository
git fetch $REMOTE_REPO

# Get the current branch name
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Reset the current branch to match the remote branch
git reset --hard $REMOTE_REPO/$current_branch