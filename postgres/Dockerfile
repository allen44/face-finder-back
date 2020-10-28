FROM postgres:latest

# standard naming from postgres image documentation...
ADD /tables/ /docker-entrypoint-initdb.d/tables/
ADD deploy_schemas.sql /docker-entrypoint-initdb.d/