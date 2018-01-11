package controllers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"fmt"
)

type CategoryController struct {
	beego.Controller
}

func (c *CategoryController) List() {
	uid := 1
	raw := orm.NewOrm()
	var rows_orm []orm.Params

	sql_ := "SELECT t.*, q.count FROM item_type  AS t	LEFT JOIN (" +
		"SELECT	type_id, count(id) AS count	FROM questions WHERE uid = %d GROUP BY type_id) AS q " +
		"ON (t.id = q.type_id) WHERE uid = %d AND priority !=0 ORDER BY priority DESC"
	sql := fmt.Sprintf(sql_, uid, uid)
	raw.Raw(sql).Values(&rows_orm)

	c.Data["json"] = map[string]interface{}{
		"data": rows_orm,
		"sql":  sql,
	}

	c.ServeJSON()
}

func (c *CategoryController) Create() {
	uid := "1"

	//获取post参数
	color := c.GetString("color", "")
	name := c.GetString("name", "")
	fade_out := c.GetString("fade_out", "0")
	priority := c.GetString("priority", "0")

	sql_ := "INSERT INTO item_type (uid, name, priority, color, fade_out) VALUES (%s, '%s', %s, '%s', %s)"
	sql := fmt.Sprintf(sql_, uid, name, priority, color, fade_out)
	raw := orm.NewOrm()
	result, err := raw.Raw(sql).Exec()
	if err != nil {
		fmt.Println(err)
	}

	c.Data["json"] = map[string]interface{}{
		"sql": sql,
		"id":  result,
		"ret": true,
	}
	c.ServeJSON()
}

func (c *CategoryController) Update() {
	//获取put参数
	color := c.GetString("color", "")
	id := c.GetString("id", "")
	name := c.GetString("name", "")
	fade_out := c.GetString("fade_out", "0")
	priority := c.GetString("priority", "0")

	sql_ := "UPDATE item_type SET name = '%s', priority = %s, color = '%s', fade_out = %s WHERE `id` = %s"
	sql := fmt.Sprintf(sql_, name, priority, color, fade_out, id)
	raw := orm.NewOrm()
	result, err := raw.Raw(sql).Exec()
	if err != nil {
		fmt.Println(err)
	}

	c.Data["json"] = map[string]interface{}{
		"sql": sql,
		"id":  result,
		"ret": true,
	}

	c.ServeJSON()
}
func (c *CategoryController) Delete() {
	//获取提交参数
	id_str := c.Ctx.Input.Param(":id")
	//id, err := strconv.ParseInt(id_str, 10, 64)

	o := orm.NewOrm()
	sql_ := "DELETE FROM item_type WHERE id = %s"
	sql := fmt.Sprintf(sql_, id_str)
	_, err := o.Raw(sql).Exec()
	if err == nil {
		fmt.Println("ok")
	} else {
		fmt.Println(err)
	}

	c.Data["json"] = map[string]interface{}{
		"success": true,
		"sql":     sql,
	}

	c.ServeJSON()
}
