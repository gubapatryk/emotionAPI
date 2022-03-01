docker build -t fapitest .
docker rm fapicon1
docker run --name fapicon1 -p 3000:3000 fapitest
