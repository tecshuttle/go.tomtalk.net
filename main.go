package main

import (
	_ "go.tomtalk.net/routers"
	"github.com/astaxie/beego"
)

func main() {
	beego.SetStaticPath("/css", "static/css")
	beego.SetStaticPath("/js", "static/js")
	beego.SetStaticPath("/img", "static/img")

	beego.Run()
}
