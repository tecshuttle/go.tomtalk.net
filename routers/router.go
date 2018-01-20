package routers

import (
	"go.tomtalk.net/controllers"
	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/", &controllers.MainController{})
	beego.Router("/category", &controllers.MainController{})
	beego.Router("/memo", &controllers.MainController{})

	beego.Router("/user/login", &controllers.UserController{}, "get:Login")
	beego.Router("/user/login-submit", &controllers.UserController{}, "post:LoginSubmit")

	beego.Router("/api/memo/get-list", &controllers.MemoController{}, "get:GetList")
	beego.Router("/api/memo", &controllers.MemoController{}, "post:Create")
	beego.Router("/api/memo/:id", &controllers.MemoController{}, "delete:Delete")
	beego.Router("/api/memo/save-item", &controllers.MemoController{}, "post:SaveItem")
	beego.Router("/api/memo/get-type-list", &controllers.MemoController{}, "get:GetTypeList")

	beego.Router("/api/category", &controllers.CategoryController{}, "get:List")
	beego.Router("/api/category", &controllers.CategoryController{}, "post:Create")
	beego.Router("/api/category", &controllers.CategoryController{}, "put:Update")
	beego.Router("/api/category/:id", &controllers.CategoryController{}, "delete:Delete")

	beego.Router("/api/todo/get-jobs-of-week", &controllers.TodoController{}, "get:GetJobsOfWeek")
	beego.Router("/api/todo/job", &controllers.TodoController{}, "post:CreateJob")
	beego.Router("/api/todo/move-job", &controllers.TodoController{}, "post:MoveJob")
}
