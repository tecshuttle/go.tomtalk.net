package controllers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"fmt"
	"time"
)

type MemoController struct {
	beego.Controller
}

func (c *MemoController) GetList() {
	uid := 1
	sql := ""
	raw := orm.NewOrm()
	var rows_orm []orm.Params

	itemType := c.GetString("item_type", "")
	today := time.Now().Format("2006-01-02")
	now := time.Now().Add(- time.Hour * 24 * 7) //一星期

	if itemType == "active" {
		sql_ := "SELECT t.name AS type, t.priority, q.* FROM questions AS q LEFT JOIN item_type AS t ON (q.type_id = t.id) " +
			"WHERE q.uid = %d AND ((t.priority = 0 AND next_play_date <= '%s') OR (t.priority > 0 AND mtime > %d)) " +
			"ORDER BY t.priority ASC, id ASC"
		sql = fmt.Sprintf(sql_, uid, today, now.Unix())
	} else if itemType == "archive" {
		sql_ := "SELECT t.name AS type, t.priority, q.* FROM questions AS q LEFT JOIN item_type AS t ON (q.type_id = t.id) " +
			"WHERE q.uid = %d AND ((t.priority = 0 AND next_play_date > '%s') OR (t.priority > 0 AND mtime <= %d)) " +
			"ORDER BY t.priority ASC, id ASC"
		sql = fmt.Sprintf(sql_, uid, today, now.Unix())
	} else if itemType == "search" {
		keyword := c.GetString("keyword", "")
		//todo: 空值不能查询
		sql_ := "SELECT t.name AS type, t.priority, q.* FROM questions AS q LEFT JOIN item_type AS t ON (q.type_id = t.id) " +
			"WHERE q.uid = %d AND (q.question LIKE '%%%s%%' OR q.answer LIKE '%%%s%%')"
		sql = fmt.Sprintf(sql_, uid, keyword, keyword)
	} else {
		sql = fmt.Sprintf("SELECT t.name AS type, t.priority, q.* FROM questions AS q LEFT JOIN item_type AS t ON (q.type_id = t.id) WHERE t.name = '%s' AND q.uid = %d", itemType, uid)
	}

	raw.Raw(sql).Values(&rows_orm)

	//输出数据
	c.Data["json"] = map[string]interface{}{
		"data": rows_orm,
	}

	c.ServeJSON()
}

func (c *MemoController) GetTypeList() {
	uid := 1
	raw := orm.NewOrm()
	var rows_orm []orm.Params

	sql_ := "SELECT COUNT(q.uid) AS count, t.id as type_id, t.priority, t.name AS type, t.color " +
		"FROM item_type AS t LEFT JOIN (select * from questions where uid = %d) AS q ON (q.type_id = t.id) " +
		"WHERE t.uid = %d AND t.priority !=0 GROUP BY t.id ORDER BY count DESC"

	sql := fmt.Sprintf(sql_, uid, uid)
	raw.Raw(sql).Values(&rows_orm)

	c.Data["json"] = map[string]interface{}{
		"data": rows_orm,
	}

	c.ServeJSON()
}

func (c *MemoController) SaveItem() {
	uid := "1"
	//获取post参数
	id := c.GetString("id", "")
	type_id := c.GetString("type_id", "")
	question := c.GetString("question", "")
	answer := c.GetString("answer", "")
	explain := c.GetString("explain", "")
	sync_state := c.GetString("sync_state", "")
	mtime := c.GetString("mtime", "")

	today := time.Now().Format("2006-01-02")
	now := time.Now().Unix()
	sql := ""

	if id == "0" {
		sql_ := "INSERT INTO questions (uid, question, answer, `explain`, type_id, next_play_date, mtime) " +
			"VALUES (%s, '%s', '%s', '%s', %s, '%s', %d)"
		sql = fmt.Sprintf(sql_, uid, question, answer, explain, type_id, today, now)
	} else if mtime == "" {
		sync := " , sync_state = 'modify' "
		if sync_state == "add" {
			sync = ""
		}
		sql_ := "UPDATE questions SET question = '%s', answer = '%s', `explain` = '%s', type_id = %s, mtime = %d" + sync + " WHERE id = %s AND uid = %s"
		sql = fmt.Sprintf(sql_, question, answer, explain, type_id, now, id, uid)
	} else {
		sql = "UPDATE questions SET mtime = " + mtime + ", sync_state = 'modify' WHERE id = " + id + " AND uid = " + uid
	}

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

func (c *MemoController) SaveCategory() {
	uid := "1"

	//获取post参数
	color := c.GetString("color", "")
	id := c.GetString("id", "")
	name := c.GetString("type_name", "")
	fade_out := c.GetString("fade_out", "0")
	priority := c.GetString("priority", "0")
	//sync_state := c.GetString("sync_state", "")

	sql := ""

	if id == "0" {
		sql_ := "INSERT INTO item_type (uid, name, priority, color, fade_out) " +
			"VALUES (%s, '%s', %s, '%s', %s)"
		sql = fmt.Sprintf(sql_, uid, name, priority, color, fade_out)
	} else {
		sql_ := "UPDATE item_type SET " +
			"name = '%s', priority = %s, color = '%s', fade_out = %s WHERE `id` = %s"
		sql = fmt.Sprintf(sql_, name, priority, color, fade_out, id)
	}

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
