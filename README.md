# go.tomtalk.net
Code of tomtalk.net in golang version.


## 使用nginx反向代理，把8080、3000端口。

```
location / {
    proxy_pass http://192.168.1.57:3000;
}

location /api {
    proxy_pass http://192.168.1.57:8080;
}
```