package controllers

import (
	"github.com/astaxie/beego"
	"fmt"
	"time"
	"github.com/astaxie/beego/orm"
	"strconv"
)

type TodoController struct {
	beego.Controller
}

func (c *TodoController) GetJobsOfWeek() {
	day := c.GetString("day", "")

	//先把本周内的所有任务取出来
	allJobsOfWeek, sql := getAllJobsOfWeek(day)

	//再把任务按日期分组输出
	list := gatherJobsByDay(allJobsOfWeek)
	c.Data["json"] = map[string]interface{}{
		"rows": allJobsOfWeek,
		"data": list,
		"sql":  sql,
	}

	c.ServeJSON()
}

func getAllJobsOfWeek(day string) ([]orm.Params, string) {
	uid := 1
	week := getTimeRangeOfWeek(day)
	sql_ := "SELECT * FROM tomtalk.todo_lists " +
		"WHERE user_id = %d AND start_time >= %d AND start_time <= %d " +
		"ORDER BY status DESC, start_time ASC"
	sql := fmt.Sprintf(sql_, uid, week["start"], week["end"])

	raw := orm.NewOrm()
	var rows []orm.Params
	num, err := raw.Raw(sql).Values(&rows)
	if err == nil && num > 0 {
		//something
	} else {
		fmt.Println(err)
	}

	return rows, sql
}

var loc, _ = time.LoadLocation("Asia/Shanghai") //指定时区

func getTimeRangeOfWeek(day string) map[string]int64 {

	timeDay, _ := time.ParseInLocation("2006-01-02", day, loc)

	iWeek := int64(timeDay.Weekday())
	iTime := timeDay.Unix()

	start := iTime - 3600*24*(iWeek-1)
	end := iTime + 3600*24*(8-iWeek) - 1
	if iWeek == 0 {
		start = iTime - 3600*24*6
		end = iTime + 3600*24 - 1
	}

	return map[string]int64{
		"start": start,
		"end":   end,
	}
}

//把任务按日期分组输出
func gatherJobsByDay(jobsOfWeek []orm.Params) [][]orm.Params {
	list := make(map[int64][]orm.Params)

	var iWeek int64
	for _, job := range jobsOfWeek {
		startTime, _ := strconv.ParseInt(fmt.Sprintf("%s", job["start_time"]), 10, 64)
		iWeek = int64(time.Unix(startTime, 0).Weekday())
		list[iWeek] = append(list[iWeek], job)
	}

	/*
	//补全7天的数据，数据缺失，页面显示会出错。
	for	($i = 0; $i < 7; $i++) {
		if (!isset($list[$i])) {
			$list[$i] = array();
		}
	}*/

	//输出为数组。第0天为星期天，转为第6天，其它天下标-1，往前提一天。
	arr := make([][]orm.Params, 7)
	for i, day := range list {
		if i == 0 {
			arr[6] = day
		} else {
			arr[i-1] = day
		}
	}

	return arr
}

func parseInt(intStr interface{}) (number int64) {
	number, _ = strconv.ParseInt(fmt.Sprintf("%s", intStr), 10, 64)
	return
}

func (c *TodoController) CreateJob() {
	uid := 1
	id := int64(0)

	//取得任务当天的开始时间
	iDay, _ := strconv.ParseInt(c.GetString("i_day", ""), 10, 64)
	weekDay := c.GetString("week_day", "")
	week := getTimeRangeOfWeek(weekDay)

	startTime := week["start"] + (iDay-1)*(3600*24)
	if iDay == 0 {
		startTime = week["start"] + 6*(3600*24)
	}

	//如果当天已存在任务，则新任务添加在原有任务后面
	hasJob, job, sql1 := isHadJobDay(startTime)
	if hasJob {
		startTime = parseInt(job["start_time"]) + parseInt(job["time_long"]) + 1
	}

	SQL := "INSERT INTO tomtalk.todo_lists (user_id, job_name, project_id, start_time, time_long) VALUES (%d, '%s', %d, '%d', %d)"
	sql2 := fmt.Sprintf(SQL, uid, "#", 0, startTime, 3600)
	raw := orm.NewOrm()

	result, err := raw.Raw(sql2).Exec()
	if err != nil {
		fmt.Println(err)
	} else {
		id, _ = result.LastInsertId()
	}

	c.Data["json"] = map[string]interface{}{
		"success": true,
		"id":      id,
		"sql1":    sql1,
		"sql2":    sql2,
		"job":     job,
	}
	c.ServeJSON()
}

func isHadJobDay(start int64) (bool, orm.Params, string) {
	end := start + 3600*24 - 1
	SQL := "SELECT * FROM tomtalk.todo_lists WHERE start_time >=%d AND start_time <= %d ORDER BY start_time DESC"
	sql := fmt.Sprintf(SQL, start, end)

	raw := orm.NewOrm()
	var rows []orm.Params
	num, err := raw.Raw(sql).Values(&rows)
	if err != nil {
		fmt.Println(err)
	}

	if num == 0 {
		return false, rows[0], sql
	} else {
		return true, rows[0], sql
	}
}
