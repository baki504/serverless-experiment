# serverless-experiment

## install

```sh
# install dependencies
npm i

# install local dybnamodb
yarn run sls dynamodb install
```

## how to run

```sh
# endpoint local
export ENDPOINT=http://localhost:3000

# endpoint production(aws)
export ENDPOINT=<aws-endpoint>

# start local app
yarn run sls offline start -v

# start app on aws
yarn run sls deploy -y
```

## run api

```
# create item
curl -v -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"description":"ディスクリプションのテスト1","created_at":1532274721534,"id":"1","title":"タイトルのテスト1","modified_at":1532274721534}'  ${ENDPOINT}/dev/api/items/create

# read item
curl -v -X GET ${ENDPOINT}/dev/api/items

# update item
curl -v -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"description":"ディスクリプションのテスト1","created_at":1532274721534,"id":"1","title":"タイトルのテスト1","modified_at":1532274721534}'  ${ENDPOINT}/dev/api/items/2/update

# delete item
curl -H "Accept: application/json" -H "Content-type: application/json" -X DELETE -d '{}' ${ENDPOINT}/dev/api/items/2/delete
```

## how to exit

```sh
# remove local db
yarn run sls dynamodb remove

# remove help
sls remove --help
```
