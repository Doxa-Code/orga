#!/bin/bash
npm run service:dev:start

export NODE_ENV=development

CMD="turbo start"

for arg in "$@"; do
  CMD+=" --filter=$arg"
done

$CMD

npm run service:dev:stop