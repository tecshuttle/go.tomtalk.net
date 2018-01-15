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
	keyword := c.GetString("keyword", "")
	today := time.Now().Format("2006-01-02")
	now := time.Now().Add(- time.Hour * 24 * 7) //一星期

	if itemType == "" && keyword == "" {
		sql_ := "SELECT t.name AS type, t.color, t.priority, q.* FROM questions AS q LEFT JOIN item_type AS t ON (q.type_id = t.id) " +
			"WHERE q.uid = %d AND ((t.priority = 0 AND next_play_date <= '%s') OR (t.priority > 0 AND mtime > %d) OR q.type_id = 0) " +
			"ORDER BY t.priority ASC, id ASC"
		sql = fmt.Sprintf(sql_, uid, today, now.Unix())
	} else if itemType == "archive" {
		sql_ := "SELECT t.name AS type, t.color, t.priority, q.* FROM questions AS q LEFT JOIN item_type AS t ON (q.type_id = t.id) " +
			"WHERE q.uid = %d AND ((t.priority = 0 AND next_play_date > '%s') OR (t.priority > 0 AND mtime <= %d)) " +
			"ORDER BY t.priority ASC, id ASC"
		sql = fmt.Sprintf(sql_, uid, today, now.Unix())
	} else if keyword != "" {
		//todo: 空值不能查询
		sql_ := "SELECT t.name AS type, t.color, t.priority, q.* FROM questions AS q LEFT JOIN item_type AS t ON (q.type_id = t.id) " +
			"WHERE q.uid = %d AND (q.question LIKE '%%%s%%' OR q.answer LIKE '%%%s%%')"
		sql = fmt.Sprintf(sql_, uid, keyword, keyword)
	} else { // 分类查询
		sql = fmt.Sprintf("SELECT t.name AS type, t.color, t.priority, q.* FROM questions AS q LEFT JOIN item_type AS t ON (q.type_id = t.id) "+
			"WHERE q.uid = %d AND t.name = '%s' ", uid, itemType)
	}

	raw.Raw(sql).Values(&rows_orm)

	//输出数据
	c.Data["json"] = map[string]interface{}{
		"data": rows_orm,
		"sql":  sql,
	}

	c.ServeJSON()
}

func (c *MemoController) GetTypeList() {
	uid := 1
	raw := orm.NewOrm()
	var rows_orm []orm.Params

	sql_ := "SELECT q.count, t.id as type_id, t.priority, t.name AS type, t.color " +
		"FROM item_type AS t LEFT JOIN (" +
		"SELECT type_id, count(id) AS count FROM questions WHERE uid = %d GROUP BY type_id ORDER BY type_id" +
		") AS q ON (q.type_id = t.id) " +
		"WHERE t.uid = %d AND t.priority !=0 ORDER BY count DESC"
	sql := fmt.Sprintf(sql_, uid, uid)
	raw.Raw(sql).Values(&rows_orm)

	c.Data["json"] = map[string]interface{}{
		"data": rows_orm,
		"sql":  sql,
	}

	c.ServeJSON()
}

func (c *MemoController) SaveItem() {
	uid := "1"
	//获取post参数
	id := c.GetString("id", "")
	type_id := c.GetString("type_id", "")
	question := Escape(c.GetString("question", ""))
	answer := Escape(c.GetString("answer", ""))
	explain := Escape(c.GetString("explain", ""))
	module := c.GetString("module", "")
	sync_state := c.GetString("sync_state", "")
	mtime := c.GetString("mtime", "")

	now := time.Now().Unix()
	sql := ""

	if mtime == "" {
		sync := " , sync_state = 'modify' "
		if sync_state == "add" {
			sync = ""
		}
		sql_ := "UPDATE questions SET module='%s', question='%s', answer='%s', `explain`='%s', type_id=%s, mtime=%d" + sync + " WHERE id=%s AND uid=%s"
		sql = fmt.Sprintf(sql_, module, question, answer, explain, type_id, now, id, uid)
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

func Escape(sql string) string {
	dest := make([]byte, 0, 2*len(sql))
	var escape byte
	for i := 0; i < len(sql); i++ {
		c := sql[i]

		escape = 0

		switch c {
		case 0: /* Must be escaped for 'mysql' */
			escape = '0'
			break
		case '\n': /* Must be escaped for logs */
			escape = 'n'
			break
		case '\r':
			escape = 'r'
			break
		case '\\':
			escape = '\\'
			break
		case '\'':
			escape = '\''
			break
		case '"': /* Better safe than sorry */
			escape = '"'
			break
		case '\032': /* This gives problems on Win32 */
			escape = 'Z'
		}

		if escape != 0 {
			dest = append(dest, '\\', escape)
		} else {
			dest = append(dest, c)
		}
	}

	return string(dest)
}

func (c *MemoController) Create() {
	uid := 1
	sql := fmt.Sprintf("INSERT INTO questions (uid, question, answer, `explain`) VALUES(%d, '', '', '')", uid)

	raw := orm.NewOrm()
	result, err := raw.Raw(sql).Exec()
	id := int64(0)
	if err != nil {
		fmt.Println(err)
	} else {
		id, _ = result.LastInsertId()
	}

	c.Data["json"] = map[string]interface{}{
		"sql": sql,
		"id":  id,
		"ret": true,
	}

	c.ServeJSON()
}

func (c *MemoController) Delete() {
	idStr := c.Ctx.Input.Param(":id")

	o := orm.NewOrm()
	sql := fmt.Sprintf("DELETE FROM questions WHERE id = %s", idStr)
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
