# serverless-experiment

## requirements
- [Node(12.x)](https://nodejs.org)
- Serverless Framework CLI
    - `npm install -g serverless`
- [AWS Credencials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials)

## install

```sh
# install dependencies
npm i

# install local dybnamodb
yarn run sls dynamodb install
```

## how to run

```sh
# start local app
yarn run sls offline start -v

# start app on aws
yarn run sls deploy -y
```

## run api

```
# endpoint local
export ENDPOINT=http://localhost:3000

# endpoint production(aws)
export ENDPOINT=<aws-endpoint>

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

# remove aws instances
sls remove
```

## Refference
https://kcf-developers.hatenablog.jp/entry/2018/10/11/114516
