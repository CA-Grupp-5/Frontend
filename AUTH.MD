# Authentication

## Overview

The mobile app uses a backend API hosted on Azure to authenticate users.

## Authentication Flow
Login/Signup> Protected Tabs> Logout(clear auth state)

(Packages are fetched right after authentication)

#Validation

Zod schema in frontend and checks in backend


## Sign up domain restrictions
- Limited sign up to domains in [selected domains list](allowedDomains.json).

