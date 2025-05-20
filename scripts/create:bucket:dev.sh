#!/bin/bash

if aws s3api head-bucket --bucket orga-staging --endpoint-url=http://localhost:4566 --region sa-east-1 > /dev/null 2>&1; then 
    echo 'Bucket já existe'; 
else 
    aws s3api create-bucket --endpoint-url=http://localhost:4566 --bucket orga-staging --region sa-east-1 --create-bucket-configuration LocationConstraint=sa-east-1 > /dev/null 2>&1 && 
    echo 'Bucket criado com sucesso' || 
    echo 'Falha ao criar bucket'; 
fi