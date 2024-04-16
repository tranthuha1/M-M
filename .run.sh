#!bin/bash
    sed -i 's/VUE_APP_BASE_API_URL/#VUE_APP_BASE_API_URL/g' .env.production
if [[ "$T_CI_TAG" =~ ^dev_.* ]]; then
    echo "DEV BUILD"
    echo $T_CI_TAG
    echo $T_CI_DEV >> .env.production
    cat .env.production
fi
if [[ "$T_CI_TAG" =~ ^staging_.* ]]; then
    echo "STAGING BUILD"
    echo $T_CI_TAG
    echo $T_CI_STAG >> .env.production
    cat .env.production
fi
if [[ "$T_CI_TAG" =~ ^pro.* ]]; then
    echo "PRO BUILD"
    echo $T_CI_TAG
    echo $T_CI_PRO >> .env.production
    cat .env.production
fi