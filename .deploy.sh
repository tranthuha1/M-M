#!bin/bash

if [[ "$T_CI_TAG" =~ ^dev_.* ]]; then
    echo "DEV DEPLOY"
    echo $T_TAG_COMMIT
    curl -X POST --fail -F token='glptt-1e5848268abe2f6d8c8b80cfdfbb83c30a9c3f80' -F ref=main -F variables[CURRENT_IMAGE_PORTAL_DEV]="$T_TAG_COMMIT" 'https://gitlab-dvkt.vivas.vn/api/v4/projects/25/trigger/pipeline' -v
fi
if [[ "$T_CI_TAG" =~ ^staging_.* ]]; then
    echo "STAG DEPLOY"
    echo $T_TAG_COMMIT
    curl -X POST --fail -F token='glptt-d9b0e99562e5da7d622ecc0ac8801e045038a9a1' -F ref=main -F variables[CURRENT_IMAGE_PORTAL_STAGING]="$T_TAG_COMMIT" 'https://gitlab-dvkt.vivas.vn/api/v4/projects/25/trigger/pipeline' -v
fi
if [[ "$T_CI_TAG" =~ ^pro.* ]]; then
    echo "PRO DEPLOY"
    curl -X POST --fail -F token='glptt-a59cec90474e988be2d34a3b5682c4e3554e6b16' -F ref=main -F variables[CURRENT_IMAGE_PORTAL_PRO]="$T_TAG_COMMIT" 'https://gitlab-dvkt.vivas.vn/api/v4/projects/25/trigger/pipeline' -v
fi