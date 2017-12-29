package models

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

type Users struct {
	Uid      int64 `orm:"pk"`
	Name     string
	Password string
	Email    string
}

type Questions struct {
	Id           int64
	Uid          int64
	Question     string
	Answer       string
	Explain      string
	NextPlayDate string
	Familiar     int64
	CorrectCount int64
	CreateDate   string
	SyncState    string
	Mtime        int64
}

type ItemType struct {
	Id        int64
	Uid       int64
	Name      string
	Priority  string
	Color     string
	FadeOut   int64
	SyncState string
}

func init() {
	//注册数据库要放在注册模型前，否则程序启动时会随机报错：must have one register DataBase alias named `default`
	user := beego.AppConfig.String("db_user")
	password := beego.AppConfig.String("db_password")
	hostname := beego.AppConfig.String("db_hostname")

	database_default := beego.AppConfig.String("db_database_default")
	orm.RegisterDataBase("default", "mysql", user+":"+password+"@tcp("+hostname+")/"+database_default+"?charset=utf8")
	orm.RegisterModel(new(Questions), new(ItemType))

	database_tomtalk := beego.AppConfig.String("db_database_tomtalk")
	orm.RegisterDataBase("tomtalk", "mysql", user+":"+password+"@tcp("+hostname+")/"+database_tomtalk+"?charset=utf8")
	orm.RegisterModel(new(Users))
}
