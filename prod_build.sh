# 编译Golang
echo "1 --------- Golang building ---------"
export GOOS=linux
export GOARCH=386
#go build

# 编译React
echo "2 --------- React building ---------"
cd front-end
npm run build

# 部署本地运行环境：
echo "3 --------- deploy localhost ---------"
cp -r build/static/css/* ../static/css
cp -r build/static/js/* ../static/js
cp -r build/index.html ../views

# 复制数据库
echo "4 --------- copy database import data file ---------"
# cp app_admin.sql "$dist_path"

# 复制打包文件
cd ..
echo "5 --------- packing deploy files ---------"
dist_path="tomtalk-"`date +%F`

if [ ! -d "$dist_path" ]; then
    mkdir "$dist_path"
fi

cp go.tomtalk.net "$dist_path"
cp -r conf "$dist_path"
cp -r static "$dist_path"
cp -r views "$dist_path"

echo "6 --------- finished ---------"

#end