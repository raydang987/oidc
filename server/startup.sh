#!/bin/bash

# Migration database
npm run migrate:up
npm run seeding:up

# Start app
npm run start:prod