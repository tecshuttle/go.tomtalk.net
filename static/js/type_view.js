/*global Backbone, $, _, setTimeout, Isotope, document, console, content_view, Ext, devMode, uid */


var TypeItemView = Backbone.View.extend({
    tagName: 'div',
    className: "question-item",
    isEdit: false,

    events: {
        'click': 'edit',
        'mouseenter': 'mouseenter',
        'mouseleave': 'mouseleave'
    },

    initialize: function () {
        _.bindAll(this, 'render', 'unrender', 'remove');

        this.model.bind('change', this.render);
        this.model.bind('remove', this.unrender);
    },

    render: function () {
        var name = this.model.get('type_name');
        var color = this.model.get('color');

        var priority = parseInt(this.model.get('priority'), 10);


        var attr = '<p class="question">' +
            '<span style="width:50%">' + (priority === 0 ? '练习题' : priority + '级 备忘') + '</span>' +
            '<span style="float:right;background-color:#' + color + ';color:#' + color + ';">' + color + '</span>' +
            '</p>';

        var html = '<span class="glyphicon glyphicon-chevron-up cancel"></span>' +
            '<span class="glyphicon glyphicon-ok save"></span>' +
            '<span class="glyphicon glyphicon-tag tag"></span>' +
            '<p class="type">' + name + '</p>' +
            attr +
            '<input type="text" name="name" class="name form-control" placeholder="分类名" />' +
            '<div>' +
            '<input type="text" style="text-align: center;width:3em;float: left;" name="priority" class="color form-control" placeholder="优先级" />' +
            '<input type="color" style="width: 48px;height:21px;float: right;" name="color-picker" class="color form-control" placeholder="分类颜色" />' +
            '<input type="text" style="width:5em;float:right;text-align: center;margin-right: 1em;" name="color" class="color form-control" placeholder="分类名" />' +
            '</div>';


        $(this.el).html(html);
        $(this.el).addClass(this.model.get('sync_state'));
        return this;
    },

    unrender: function () {
        $(this.el).remove();
    },

    edit: function (event) {
        if (event.target === this.$el.find('span.cancel')[0]) {
            this.cancel();
            this.isEdit = false;
            return;
        }

        if (event.target === this.$el.find('span.save')[0]) {
            this.save();
            this.isEdit = false;
            return;
        }

        if (!this.isEdit) {
            this.isEdit = true;
            this.$el.find('p').hide();
            this.$el.find('span').show();
            this.$el.find('select').show();
            this.$el.find('input[name="name"]').show().val(this.model.get('type_name'));
            this.$el.find('input[name="color"]').show().val(this.model.get('color'));
            this.$el.find('input[name="priority"]').show().val(this.model.get('priority'));
            this.$el.find('input[name="color-picker"]').show().val('#' + this.model.get('color'));
        }
    },

    remove: function () {
        this.model.destroy();
    },

    cancel: function () {
        this.showList();
    },

    showList: function () {
        this.$el.find('span.save').hide();
        this.$el.find('span.cancel').hide();
        this.$el.find('input').hide();
        this.$el.find('p').show();
    },

    save: function () {
        this.showList();

        var color_picker = this.$el.find('input[name="color-picker"]').val();
        var color_input = this.$el.find('input[name="color"]').val();
        var color = (color_input === this.model.get('color') ? color_picker.substr(1, 6) : color_input);

        var sync_state = this.model.get('sync_state');

        this.model.set({
            type_name: this.$el.find('input[name="name"]').val(),
            priority: this.$el.find('input[name="priority"]').val(),
            color: color,
            sync_state: (sync_state === '' ? 'modify' : sync_state),
            devMode: devMode
        });

        var url = '/saveType.php';
        if (devMode) {
            url = 'http://dev.tomtalk.net' + url;
        }

        $.post(url, this.model.attributes, function (result) {
            console.log(result);
        }, 'json');
    }
});

var TypeModel = Backbone.Model.extend({
    defaults: {
        color: '000000',
        fade_out: 0,
        _id: 0,
        type_name: 'new',
        priority: 0,
        sync_state: 'add',
        uid: 0
    }
});

var TypeCollection = Backbone.Collection.extend({ model: TypeModel });

var TypeView = Backbone.View.extend({
    el: $("#content"),
    types: '',
    cul_type: 'ooxx',

    events: {
        'click button#add_type': 'addBtn'
    },

    initialize: function () {
        _.bindAll(this, 'beforeRender', 'render', 'afterRender', 'addItem', 'addBtn', 'add', 'appendItem');
        var _this = this;
        this.render = _.wrap(this.render, function (render) {
            _this.beforeRender();
            render();
            _this.afterRender();
            return _this;
        });

        this.collection = new TypeCollection();
        this.collection.bind('add', this.appendItem); // collection event binder
        this.model.bind('change', this.render);
    },

    render: function () {
        var buttons = "<button id='add_type' class='btn btn-default btn-sm'>新增分类</button>";

        $(this.el).html("<div class='topToolBar'>" + buttons + "</div>");

        $(this.el).append("<ul id='question-list' style='margin: 0; padding: 0;'></ul>");

        var self = this;
        _(this.collection.models).each(function (item) { // in case collection is not empty
            self.appendItem(item);
        }, this);
    },


    list: function () {
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

        $('#content').html(loading);

        var me = this;
        me.collection.reset();

        var url = '/get_type.php';
        if (devMode) {
            url = 'http://dev.tomtalk.net' + url;
        }

        $.ajax({
            url: url,
            type: "POST",
            data: {uid: uid},
            timeout: 6000,
            dataType: "json",
            success: function (result) {
                _.each(result, function (row) {
                    me.add(row);
                });
                me.render();
            },
            error: function () {
                $('#content').html('<div class="error">数据读取超时。<br/>Fuck! 找运维来处理：13417446590<br/></div>');
            }
        });
    },

    addItem: function () {
        var type = new TypeModel();
        this.collection.unshift(type); // add item to collection; view is updated via event 'add'
    },

    add: function (row) {
        var type = new TypeModel();

        type.set({
            color: row.color,
            fade_out: parseInt(row.fade_out, 10),
            _id: parseInt(row.id, 10),
            type_name: row.name,
            priority: parseInt(row.priority, 10),
            sync_state: row.sync_state,
            uid: parseInt(row.uid, 10)
        });

        this.collection.add(type);
    },

    appendItem: function (item) {
        var itemView = new TypeItemView({
            model: item
        });

        $('ul', this.el).prepend(itemView.render().el);
    },

    addBtn: function () {
        this.addItem();
    },

    beforeRender: function () {
        var i = 1;
        i = i + 1;
    },

    afterRender: function () {
        $('#floatingCirclesG').remove();

        if (this.collection.length === 0) {
            $('#content').append('<div class="error">没内容啊！赶紧的自己加些。</div>');
        }
    }

});

//end file
