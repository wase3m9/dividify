-- Move the http extension to the extensions schema for security best practices
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;