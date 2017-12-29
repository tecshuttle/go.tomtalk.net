/*global Backbone, $, _, setTimeout, Isotope, document, console, List, Item, ItemView, TypeView, window */

/*global TypeCollection */

function getCookie(objName) {//获取指定名称的cookie的值
    var arrStr = document.cookie.split("; ");
    var i = 0, temp;

    for (i = 0; i < arrStr.length; i = i + 1) {
        temp = arrStr[i].split("=");
        if (temp[0] === objName) {
            return temp[1];
        }
    }
}

var devMode = window.location.href.indexOf('file') === 0 ? true : false;

var uid = 0;
var login_name = '';

if (devMode) {
    uid = 1;
    login_name = 'tom';
} else {
    // read cookie
    uid = getCookie('uid');
    login_name = getCookie('name');

    if (uid !== undefined) {
        window.location.href = '/#!list';
    }
}

//定义menu
var Menu = Backbone.Model.extend({
    defaults: {
        name: "",
        text: "",
        cur: false
    }
});

var menu = new Menu();

var Menus = Backbone.Collection.extend({
    model: Menu
});

var menus = new Menus();

menus.add({name: "index", text: "介绍", cur: true});
menus.add({name: "list", text: "条目"});
menus.add({name: "type", text: "分类"});
menus.add({name: "help", text: "帮助"});

//定义view
var UserView = Backbone.View.extend({
    el: $("#menu"),
    initialize: function () {
        _.bindAll(this, 'render');
        this.collection = menus;
        this.collection.bind('change', this.render); // collection event binder

        this.render();
    },

    render: function () {
        //Mustache.js style template
        _.templateSettings = {
            interpolate: /\{\{(.+?)\}\}/g
        };

        var template = _.template("<a href='#!{{name}}' {{cur}}>{{text}}</a>");

        var html = "";

        _.each(menus.models, function (menu_models) {
            var menu = menu_models.attributes;
            var cur = menu.cur ? " class='menu-sel' " : "";
            if (menu.name === 'list' || menu.name === 'type') {
                if (uid !== undefined) {
                    html += template({cur: cur, name: menu.name, text: menu.text});
                }
            } else {
                html += template({cur: cur, name: menu.name, text: menu.text});
            }
        });

        if (uid !== undefined) {
            var logout = '<a id="logout" href="/user/logout">退出</a>';
            html += '<div class="login-name"><span class="glyphicon glyphicon-user"></span>' + login_name + logout + '</div>';
        } else {
            var login = '<a href="/user/login">登入</a>';
            html += '<div class="login-name"><span class="glyphicon glyphicon-user"></span>' + login + '</div>';
        }

        $(this.el).html(html);
    }
});

var user_view = new UserView();

//定义显示区域
var Content = Backbone.Model.extend({
    defaults: {
        text: "暂无内容"
    }
});

var content = new Content();

var ContentView = Backbone.View.extend({
    el: $("#content"),
    types: '',
    cul_type: 'ooxx',

    events: {
        'click button#add': 'addBtn',
        'click button#active_item': 'active_item',
        'click button#archive_item': 'archive_item',
        'keypress input#search_keyword': 'search_keyword',
        'click button#search': 'search_item',
        'change select#type_item': 'type_item'
    },

    initialize: function () {
        _.bindAll(this, 'beforeRender', 'render', 'afterRender', 'addItem', 'addBtn', 'appendItem', 'create_topbar', 'render_list');
        var _this = this;
        this.render = _.wrap(this.render, function (render) {
            _this.beforeRender();
            render();
            _this.afterRender();
            return _this;
        });

        this.collection = new List();
        this.collection.bind('add', this.appendItem); // collection event binder
        this.model.bind('change', this.render);
        this.counter = 0;
        this.index();
    },

    create_topbar: function () {
        var me = this;

        if (this.types === '') {

            var url = '/api/memo/get-type-list';
            if (devMode) {
                url = 'http://dev.tomtalk.net' + url;
            }

            $.ajax({
                url: url,
                type: "GET",
                data: {},
                timeout: 6000,
                dataType: "json",
                success: function (result) {
                    me.types = result.data;
                    me.render();
                },
                error: function () {
                    $('#content').html('<div class="error">分类读取出错。<br/>Fuck! 找运维来处理：13417446590<br/></div>');
                }
            });

            return false;
        }

        var buttons = "<button id='add' class='btn btn-default btn-sm'>新增条目</button>";
        buttons += "<button id='active_item' class='btn btn-default btn-sm'>活动条目</button>";
        buttons += "<button id='archive_item' class='btn btn-default btn-sm'>归档条目</button>";

        var search_btn = '<div class="input-group" id="tomtest">'
            + '    <input id="search_keyword" type="text" class="form-control">'
            + '        <span class="input-group-btn">'
            + '           <button id="search" class="btn btn-default" type="button">搜索</button>'
            + '       </span>'
            + '   </div>';

        var select = "<select id='type_item' class='btn btn-default btn-sm'>";
        select += '<option>分类</option>';

        _.each(me.types, function (item) {
            var type = item.type,
                count = ' (' + item.count + ')',
                isSelect = (me.cul_type === type ? 'selected' : '');

            var option = "<option value='" + type + "' " + isSelect + ">" +
                (type === '' ? '未分类' : type) + count +
                "</option>";

            select += option;
        });

        select += "</select>";

        $(this.el).html(
            "  <div class='topToolBar row'>"
            + '<div class="col-lg-6">' + buttons + select + "</div>"
            + '<div class="col-lg-6">' + search_btn + "</div>"
            + "</div>"
        );

        var loading = '<div id="floatingCirclesG">' +
            ' <div class="f_circleG" id="frotateG_01"> </div>' +
            ' <div class="f_circleG" id="frotateG_02"> </div>' +
            ' <div class="f_circleG" id="frotateG_03"> </div>' +
            ' <div class="f_circleG" id="frotateG_04"> </div>' +
            ' <div class="f_circleG" id="frotateG_05"> </div>' +
            ' <div class="f_circleG" id="frotateG_06"> </div>' +
            ' <div class="f_circleG" id="frotateG_07"> </div>' +
            ' <div class="f_circleG" id="frotateG_08"> </div>' +
            ' </div>';

        $(this.el).append("<ul id='question-list' style='margin: 0; padding: 0;'>" + loading + "</ul>");
    },


    render_list: function () {
        var self = this;
        _(this.collection.models).each(function (item) { // in case collection is not empty
            self.appendItem(item);
        }, this);
    },

    render: function () {
        this.create_topbar();
        this.render_list();
    },

    index: function () {
        var html = '<div class="home-slogan"><p>No more <p>great ideas <p>down the drain!</div>';
        html += '<div class="home-features">';
        html += '<h2 class="home">主要功能介绍</h2>';
        html += '<ul>';
        html += '<li>todo';
        html += '<li>memo';
        html += '<li>quiz';
        html += '<li>writer';
        html += '</ul>';
        html += '</div>';
        html += '<div class="home-screen-shot">';
        html += '<img src="../img/screen-1.jpg" />';
        html += '<img src="../img/screen-2.jpg" />';
        html += '<img src="../img/screen-3.jpg" />';
        html += '</div>';
        html += '<div class="home-download"><a href="/memorize/memorize.apk">下载 android apk</a></div>';

        $(this.el).html(html);
        return this;
    },

    list: function (item_type) {
        //先取值，否则页面被刷新就取不到值了。
        var keyword = (item_type === 'search' ? $('#search_keyword').val() : '');

        var loading = '<div id="floatingCirclesG">' +
            ' <div class="f_circleG" id="frotateG_01"> </div>' +
            ' <div class="f_circleG" id="frotateG_02"> </div>' +
            ' <div class="f_circleG" id="frotateG_03"> </div>' +
            ' <div class="f_circleG" id="frotateG_04"> </div>' +
            ' <div class="f_circleG" id="frotateG_05"> </div>' +
            ' <div class="f_circleG" id="frotateG_06"> </div>' +
            ' <div class="f_circleG" id="frotateG_07"> </div>' +
            ' <div class="f_circleG" id="frotateG_08"> </div>' +
            ' </div>';

        $('#question-list').html(loading);

        var me = this;
        me.collection.reset();

        var url = "/api/memo/get-list";
        if (devMode) {
            url = "http://www.tomtalk.net" + url;
        }

        $.ajax({
            url: url,
            type: "GET",
            data: {
                item_type: item_type,
                keyword: keyword,
                devMode: devMode
            },
            timeout: 6000,
            dataType: "json",
            success: function (result) {
                if (result.ret_code !== undefined && result.ret_code === -1) {
                    window.location.href = '/user/login';
                } else {
                    _.each(result.data, function (row) {
                        me.add(row);
                    });
                    $('#question-list').html('');
                    me.beforeRender();
                    me.render_list();
                    me.afterRender();
                    me.isoArrange();
                }
            },
            error: function () {
                $('#content').html('<div class="error">数据读取超时。<br/>Fuck! 找运维来处理：13417446590<br/></div>');
            }
        });
    },

    active_item: function () {
        this.list('active');
    },

    archive_item: function () {
        this.list('archive');
    },

    search_keyword: function (e) {
        if (e.keyCode === 13) {
            this.list('search');
        }
    },

    search_item: function () {
        this.list('search');
    },

    type_item: function (el) {
        var type = el.target.value;
        this.cul_type = type;
        this.list(type);
    },

    type: function () {
        var html = 'edit type';
        $(this.el).html(html);
        return this;
    },

    help: function () {
        var html = '<div class="help">';
        html += '<h1>为什么会有这个App?</h1>';
        html += '<p>俗话说“好记性不如烂笔头”，所以我把经常要用又不便记忆的东西写到我的wiki里，用时再翻出来看。可有不少东西使用频率还是很高的，就有必要把它们记下来，于是，就有了这APP。';

        html += '<h1>如何使用?</h1>';
        html += '<div class="h2">';
        html += '<h2>如何增加备忘录?</h2>';
        html += '<p>标题以#结尾视为备忘，不会作为题目练习记忆。';
        html += '<h2>如何提交bug、todo?</h2>';
        html += '<p>标题以bug、todo开头，后续文字用空格分开。条目具有优先级，bug会排在todo前面，这是备忘录的扩展形式。';
        html += '<h2>如何增加多选题?</h2>';
        html += '<p>按如下格式编辑答案:';
        html += '<p>是|不是|不知道|2 功能尚未实现';
        html += '<h2>答题时如何略过不答？</h2>';
        html += '<p>左右滑动屏幕。 功能尚未实现';
        html += '</div>';

        html += '<h1>如何在电脑上使用我的资料?</h1>';
        html += '<p>请登入网站页面 http://www.tomtalk.net/memorize';
        html += '</div>';

        $(this.el).html(html);
        return this;
    },

    addItem: function () {
        this.counter += 1;
        var item = new Item();
        item.set({
            question: item.get('question') // + this.counter // modify item defaults
        });

        this.collection.unshift(item); // add item to collection; view is updated via event 'add'
    },

    add: function (row) {
        var item = new Item();
        item.set({
            id: row.id,
            question: row.question,
            answer: row.answer,
            explain: row.explain,
            priority: parseInt(row.Priority, 10),
            type: row.type,
            sync_state: row.sync_state
        });

        this.collection.add(item); // add item to collection; view is updated via event 'add'
    },

    appendItem: function (item) {
        var itemView = new ItemView({
            model: item
        });

        $('ul', this.el).prepend(itemView.render().el);
    },

    addBtn: function () {
        this.addItem();
        this.isoArrange();
    },

    beforeRender: function () {
        var i = 0;
        i = i + 1;
    },

    afterRender: function () {
        $('#floatingCirclesG').remove();

        if (this.collection.length === 0) {
            $('#content').append('<div id="blank_msg" class="error">没内容啊！赶紧的自己加些。</div>');
        } else {
            $('#blank_msg').remove();
            this.isoInit();
        }
    },

    isoInit: function () {
        var $container = $('#question-list');
        $container.isotope({
            itemSelector: '.question-item'
        });
    },

    isoArrange: function () {
        var iso = new Isotope(document.querySelector('#question-list'));
        iso.arrange();
    }
});

var content_view = new ContentView({model: List});
var type_view = new TypeView({model: TypeCollection});

var PageRouter = Backbone.Router.extend({
    routes: {
        "!": "index",
        "!index": "index",
        "!list": "list",
        "!type": "type",
        "!help": "help"
    },

    index: function () {
        this.setMenu('index');
        content_view.index();
    },

    list: function () {
        this.setMenu('list');
        $('#content').html('');
        content_view.render();
        content_view.list('active');
    },

    type: function () {
        this.setMenu('type');
        type_view.list();
    },

    help: function () {
        this.setMenu('help');
        content_view.help();
    },

    setMenu: function (item) {
        _.each(menus.models, function (menu) {
            menu.set({cur: (menu.get("name") === item ? true : false)});
        });
    }
});

var page_router = new PageRouter();

Backbone.history.start();

//end file
//today go home
