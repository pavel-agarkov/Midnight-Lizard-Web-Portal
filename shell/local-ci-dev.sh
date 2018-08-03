#!/bin/sh
set -e
TAG=$(date +"%Y-%m-%d--%H-%M-%S")
PROJ=portal
REGISTRY=localhost:5000
IMAGE=$REGISTRY/$PROJ:$TAG
eval $(docker-machine env default --shell bash)
docker build -t $IMAGE \
    --build-arg BUILD_LIBS_CMD="build:dev:libs" \
    --build-arg BUILD_CMD="build:dev" \
    --build-arg RUN_CMD="debug:ssr" \
    ../app
kubectl config use-context minikube
docker push $IMAGE
secret=$(echo -n not-a-secret | base64 -w 0);
./helm-deploy.sh -i $IMAGE -r $PROJ -c ../kube/$PROJ \
    --set env.IDENTITY_URL=http://192.168.1.35:32006 \
    --set env.PORTAL_URL=http://192.168.1.35:31565 \
    --set secrets.sessionSecret=$secret \
