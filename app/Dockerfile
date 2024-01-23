# FROM public.ecr.aws/lambda/nodejs:16-arm64 --> only from localhost macos
FROM public.ecr.aws/lambda/nodejs:16

COPY . .

RUN npm install --prefer-offline --no-audit && npm run build