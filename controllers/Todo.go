package controllers

import (
	"github.com/astaxie/beego"
	"fmt"
	"time"
	"github.com/astaxie/beego/orm"
	"strconv"
	"strings"
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
	SQL := "SELECT * FROM tomtalk.todo_lists " +
		"WHERE user_id = %d AND start_time >= %d AND start_time <= %d " +
		"ORDER BY status DESC, start_time ASC"
	sql := fmt.Sprintf(SQL, uid, week["start"], week["end"])

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
	sql2 := fmt.Sprintf(SQL, uid, "", 0, startTime, 3600)
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

/**
 * 调整任务的时间
 * 1、如果没有后续任务，则本任务时间为前一任务start_time + 1
 * 2、如果有后续任务，则本任务时间为前一任务start_time + 1，后续任务时间顺延
 * 3、如果没有前置任务，则本任务时间为当日0时，后续任务顺延
 */
func (c *TodoController) MoveJob() {
	id := c.GetString("id", "") //取job ID
	prevJobId := c.GetString("prev_job_id", "")
	nextJobId := c.GetString("next_job_id", "")
	toDay := c.GetString("to_day", "")
	weekDate := c.GetString("week_date", "")

	//没有前置任务
	if prevJobId == "0" {
		day := getTimeRangeOfDay("to_day", toDay, weekDate)
		allJobs := allJobsOfDay(day)

		//当前任务，全部移到当天结束前最后时刻
		for key, row := range allJobs {
			SQL := "UPDATE tomtalk.todo_lists SET start_time = %d WHERE id = %d"
			sql := fmt.Sprintf(SQL, day["end"]-int64(len(allJobs))+int64(key), parseInt(row["id"]))
			raw := orm.NewOrm()
			_, err := raw.Raw(sql).Exec()
			if err != nil {
				fmt.Println(err)
			}
		}

		//把当前任务，放到本日最前面
		SQL := "UPDATE tomtalk.todo_lists SET start_time = %d WHERE id = %s"
		sql := fmt.Sprintf(SQL, day["start"], id)
		raw := orm.NewOrm()
		_, err := raw.Raw(sql).Exec()
		if err != nil {
			fmt.Println(err)
		}

		//后续任务顺延
		reorderRestJobStartTime(id)
	}

	//没有后续任务
	if nextJobId == "0" {
		//取目的日期，最后一个任务
		day := getTimeRangeOfDay("to_day", toDay, weekDate)
		allJobs := allJobsOfDay(day)
		lastJob := allJobs[len(allJobs)-1]

		SQL := "UPDATE tomtalk.todo_lists SET start_time = %d WHERE id = %d"
		sql := fmt.Sprintf(SQL, parseInt(lastJob["start_time"])+1, parseInt(id))
		raw := orm.NewOrm()
		_, err := raw.Raw(sql).Exec()
		if err != nil {
			fmt.Println(err)
		}

		reorderRestJobStartTime(fmt.Sprintf("%s", allJobs[0]["id"])) //后续任务顺延
	}

	//接前置任务，后续任务顺延
	if prevJobId != "0" && nextJobId != "0" {
		//取任务当天的结束时间
		job := getJobById(id)

		dayStr := time.Unix(parseInt(job["start_time"]), 0).Format("2006-01-02") //设置时间戳 使用模板格式化为日期字符串
		start, _ := time.ParseInLocation("2006-01-02", dayStr, loc)
		endOfDay := start.Unix() + 3600*24 - 1

		//当前任务以下，全部移到当天结束前最后时刻
		allJobs := siblingsOfJob(id)
		isFind := false
		for key, row := range allJobs {
			if isFind {
				SQL := "UPDATE tomtalk.todo_lists SET start_time = %d WHERE id = %d"
				sql := fmt.Sprintf(SQL, endOfDay-int64(len(allJobs))+int64(key), parseInt(row["id"]))
				raw := orm.NewOrm()
				_, err := raw.Raw(sql).Exec()
				if err != nil {
					fmt.Println(err)
				}
			}

			if parseInt(row["id"]) == parseInt(prevJobId) {
				isFind = true
			}
		}

		//当前任务，移到前置任务后
		prevJob := getJobById(prevJobId)
		SQL := "UPDATE tomtalk.todo_lists SET start_time = %d WHERE id = %d"
		sql := fmt.Sprintf(SQL, parseInt(prevJob["start_time"])+1, parseInt(id))
		raw := orm.NewOrm()
		_, err := raw.Raw(sql).Exec()
		if err != nil {
			fmt.Println(err)
		}

		reorderRestJobStartTime(id) //后续任务顺延
	}

	c.Data["json"] = map[string]interface{}{
		"success": true,
	}

	c.ServeJSON()
}

//周视图传to_day参数
//日视图传date参数
func getTimeRangeOfDay(viewType string, day string, weekDate string) map[string]int64 {
	start := int64(0)

	if viewType == "date" {
		/*
	    $date = $this->input->post('date', true);
		$start = strtotime($date);
		$day   = (object)array(
		'start' => $start,
		'end'   => $start + 3600 * 24 - 1
		);

		return $day;
		*/
	}

	if viewType == "to_day" {
		toDay, _ := strconv.ParseInt(substr(day, 3, 1), 10, 64)
		week := getTimeRangeOfWeek(weekDate)

		if toDay == 0 {
			start = week["start"] + 6*(3600*24)
		} else {
			start = week["start"] + (toDay-1)*(3600*24)
		}
	}

	return map[string]int64{
		"start": start,
		"end":   start + 3600*24 - 1,
	}
}

func substr(str string, start int, length int) string {
	rs := []rune(str)
	rl := len(rs)
	end := 0

	if start < 0 {
		start = rl - 1 + start
	}
	end = start + length

	if start > end {
		start, end = end, start
	}

	if start < 0 {
		start = 0
	}
	if start > rl {
		start = rl
	}
	if end < 0 {
		end = 0
	}
	if end > rl {
		end = rl
	}

	return string(rs[start:end])
}

//取任务当天，全部任务
func allJobsOfDay(day map[string]int64) []orm.Params {
	SQL := "SELECT * FROM tomtalk.todo_lists WHERE start_time >= %d AND start_time <= %d ORDER BY start_time ASC"
	sql := fmt.Sprintf(SQL, day["start"], day["end"])

	raw := orm.NewOrm()
	var rows []orm.Params
	num, err := raw.Raw(sql).Values(&rows)
	if err == nil && num > 0 {
		//something
	} else {
		fmt.Println(err)
	}

	return rows
}

func reorderRestJobStartTime(jobId string) {
	job := getJobById(jobId)
	restStart := parseInt(job["start_time"]) + 1
	allJobs := siblingsOfJob(jobId)
	isFind := false

	for _, row := range allJobs {
		if isFind {
			SQL := "UPDATE tomtalk.todo_lists SET start_time = %d WHERE id = %d"
			sql := fmt.Sprintf(SQL, restStart, parseInt(row["id"]))
			raw := orm.NewOrm()
			_, err := raw.Raw(sql).Exec()
			if err != nil {
				fmt.Println(err)
			}

			restStart += 1
		}

		if parseInt(row["id"]) == parseInt(jobId) {
			isFind = true
		}
	}
}

func getJobById(id string) orm.Params {
	SQL := "SELECT * FROM tomtalk.todo_lists WHERE id= %s"
	sql := fmt.Sprintf(SQL, id)

	raw := orm.NewOrm()
	var rows []orm.Params
	num, err := raw.Raw(sql).Values(&rows)
	if err == nil && num > 0 {
		//something
	} else {
		fmt.Println(err)
	}

	return rows[0]
}

// 取出当前job在所日的所有job。
func siblingsOfJob(jobId string) []orm.Params {
	job := getJobById(jobId)

	//取任务当天的结束时间
	dayStr := time.Unix(parseInt(job["start_time"]), 0).Format("2006-01-02") //设置时间戳 使用模板格式化为日期字符串
	start, _ := time.ParseInLocation("2006-01-02", dayStr, loc)
	endOfDay := start.Unix() + 3600*24 - 1

	SQL := "SELECT * FROM tomtalk.todo_lists WHERE start_time >= %d AND start_time <= %d ORDER BY start_time ASC"
	sql := fmt.Sprintf(SQL, start.Unix(), endOfDay)

	raw := orm.NewOrm()
	var rows []orm.Params
	num, err := raw.Raw(sql).Values(&rows)
	if err == nil && num > 0 {
		//something
	} else {
		fmt.Println(err)
	}

	return rows
}

func (c *TodoController) Delete() {
	idStr := c.Ctx.Input.Param(":id")

	o := orm.NewOrm()
	sql := fmt.Sprintf("DELETE FROM tomtalk.todo_lists WHERE id = %s", idStr)
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

func (c *TodoController) Update() {
	id := c.GetString("id", "")
	fields := map[string]string{
		"project_id":   c.GetString("project_id", ""),
		"job_name":     c.GetString("job_name", ""),
		"job_desc":     c.GetString("job_desc", ""),
		"job_type_id":  c.GetString("job_type_id", ""),
		"time_long":    c.GetString("time_long", ""),
		"task_type_id": "0",
	}

	if fields["job_type_id"] == "3" {
		fields["task_type_id"] = c.GetString("task_type_id", "")
	}

	//是否要切换日期
	startTime := c.GetString("start_time", "")
	if startTime != "" {
		fields["start_time"] = startTime
	}

	status := c.GetString("status", "")
	//标记任务是否完成。任务，列在完成队列尾部。
	if status != "" {
		fields["status"] = status
		if startTime == "" {
			//取最后一个完成的任务
			culJob := getJobById(id)
			jobDate := time.Unix(parseInt(culJob["start_time"]), 0).Format("2006-01-02")
			lastDoneJob, ret := getLastDoneJob(jobDate)

			if ret {
				fields["start_time"] = fmt.Sprintf("%d", parseInt(lastDoneJob["start_time"])+int64(1))
			}
		}
	}

	UpdateById("tomtalk.todo_lists", fields, id)

	c.Data["json"] = map[string]interface{}{
		"success": true,
	}

	c.ServeJSON()
}

func UpdateById(table string, fields map[string]string, id string) {
	var setFields = make([]string, 0, len(fields))

	for key, value := range fields {
		setFields = append(setFields, key+"='"+value+"'")
	}

	SQL := "UPDATE %s SET %s WHERE id=%s"
	sql := fmt.Sprintf(SQL, table, strings.Join(setFields, ", "), id)

	raw := orm.NewOrm()
	_, err := raw.Raw(sql).Exec()
	if err != nil {
		fmt.Println(err)
	}
}

func getLastDoneJob(date string) (orm.Params, bool) {
	dayStart, _ := time.ParseInLocation("2006-01-02 15:04:05", date+" 00:00:00", loc)
	dayEnd, _ := time.ParseInLocation("2006-01-02 15:04:05", date+" 23:59:59", loc)

	SQL := "SELECT * FROM tomtalk.todo_lists WHERE start_time >= %d AND start_time <= %d AND status = 1 ORDER BY start_time ASC"
	sql := fmt.Sprintf(SQL, dayStart.Unix(), dayEnd.Unix())
	raw := orm.NewOrm()
	var rows []orm.Params
	num, err := raw.Raw(sql).Values(&rows)
	if err == nil && num > 0 {
		//something
	} else {
		fmt.Println(err)
		return rows[0], false
	}

	return rows[len(rows)-1], true
}
