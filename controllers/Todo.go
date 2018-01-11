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

	//输出为数组
	arr := make([][]orm.Params, 7)
	for i, day := range list {
		arr[i] = day
	}

	return arr
}
