#!/bin/bash

# project path
projectPath=$(cd . $0; pwd)

# copy project.config.json
cp ${projectPath}/project.config.json ${projectPath}/dist/build/mp-weixin

# open project
/Applications/wechatwebdevtools.app/Contents/MacOS/cli open --project ${projectPath}/dist/build/mp-weixin
