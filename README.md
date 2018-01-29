# go.tomtalk.net

Code of tomtalk.net in golang version.

## 安装

1. 克隆代码

2. 以app.example.conf为模板，配置运行参数。

3. `nohup ./go.tomtalk.net &`

4. end

## 开发环境下使用nginx反向代理，融合8080、3000到80端口。

```
location / {
    proxy_pass http://192.168.1.57:3000;
}

location /api {
    proxy_pass http://192.168.1.57:8080;
}
```

END