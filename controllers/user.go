package controllers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"fmt"
	"go.tomtalk.net/models"
	"crypto/md5"
	"io"
	"encoding/hex"
	"net/http"
	"time"
)

type UserController struct {
	beego.Controller
}

func (c *UserController) Login() {
	c.TplName = "login.html"
}

func (c *UserController) LoginSubmit() {
	email := c.GetString("email", "")
	password := c.GetString("password", "")

	//从数据库中取用户数据
	o := orm.NewOrm()
	o.Using("tomtalk")

	//用md5加密用户口令
	m := md5.New()
	io.WriteString(m, password)
	passwordMd5 := hex.EncodeToString(m.Sum(nil))

	user := models.Users{Email: email, Password: passwordMd5}

	if err := o.Read(&user, "email", "password"); err != nil {
		fmt.Println(err)
	} else {
		c.SetSession("uid", user.Uid)
		c.SetSession("user_name", user.Name)
		c.SetSession("user_email", user.Email)

		afterMonth := time.Now().Add(time.Hour * 24 * 30) //30天

		uid := http.Cookie{
			Name:     "uid",
			Value:    fmt.Sprintf("%d", user.Uid),
			Path:     "/",
			Expires:  afterMonth,
		}

		c.Ctx.ResponseWriter.Header().Set("Set-Cookie", uid.String())

		name := http.Cookie{
			Name:     "name",
			Value:    user.Name,
			Path:     "/",
			Expires:  afterMonth,
		}

		c.Ctx.ResponseWriter.Header().Add("Set-Cookie", name.String())
	}

	c.Ctx.Redirect(302, "/")
}
