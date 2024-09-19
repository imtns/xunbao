#!/bin/bash

# 正式版需要打TAG
if [ $1 = "prod" ]
then
  echo "请输入Tag:"
  read tag
  echo "请输入Tag注释:"
  read te
  git tag -a $tag -m "$te"
  # 判断新建tag是否成功
  out=$?
  if [ $out -ne 0 ]
  then
    echo "......新建tag出错了，请检查输入的tag是否已存在......"
    exit 0
  fi
  # 新建tag成功，push tag...
  echo "你输入的tag是 $tag "$te""
  git push origin --tags
else
  echo "非正式版，不用打tag..."
fi

# project path
projectPath=$(cd . $0; pwd)

# copy project.config.json
cp ${projectPath}/project.config.json ${projectPath}/dist/dev/mp-weixin

# open project
/Applications/wechatwebdevtools.app/Contents/MacOS/cli open --project ${projectPath}/dist/dev/mp-weixin
