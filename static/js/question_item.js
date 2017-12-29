/*global Backbone, $, _, setTimeout, Isotope, document, console, content_view, Ext, devMode */

var Item = Backbone.Model.extend({
    defaults: {
        id: 0,
        question: '#',
        answer: '',
        explain: '',
        priority: 0,
        type: 'memo',
        sync_state: 'add'
    }
});

var ItemView = Backbone.View.extend({
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
        var type = Ext.String.htmlEncode(this.model.get('type'));
        var question = Ext.String.htmlEncode(this.model.get('question'));
        var answer = Ext.String.htmlEncode(this.model.get('answer'));

        var answer_p = '';

        if (this.model.get('is_memo') !== 0) {
            answer_p = (answer === '' ? '' : '<p class="answer">' + this.item_html(answer) + '</p>');
        }

        var html = '<span class="glyphicon glyphicon-chevron-up cancel"></span>' +
            '<span class="glyphicon glyphicon-ok save"></span>' +
            '<span class="glyphicon glyphicon-tag tag"></span>' +
            '<span class="glyphicon glyphicon-inbox archive"></span>' +
            '<p class="type">' + type + '</p>' +
            '<p class="question">' + this.item_html(question) + '</p>' +
            answer_p +
            this.get_html_select_type(type) +
            '<textarea name="question" class="question form-control" placeholder="题目"></textarea>' +
            '<textarea name="answer" class="answer form-control" placeholder="答案"></textarea>' +
            '<textarea name="explain" class="explain form-control" placeholder="题解"></textarea>';

        $(this.el).html(html);
        $(this.el).addClass(this.model.get('sync_state'));
        $(this.el).css('color', this.get_type_color());

        return this;
    },

    get_html_select_type: function (type) {
        var types = content_view.types,
            name,
            isCheck,
            select = '<select style="display:none;">';

        _(types).each(function (item) {
            name = item.type;
            isCheck = (type === item.type ? 'selected="selected"' : '');

            if (name !== '') {
                select += '<option value="' + name + '"' + isCheck + '>' + name + '</option>';
            }

        }, this);

        select += '</select>';

        return select;
    },

    get_type_color: function () {
        var types = content_view.types;
        var type = this.model.get('type');
        var color = '';

        _(types).each(function (item) {
            if (item.type === type) {
                color = '#' + item.color;
            }
        });

        return color;
    },

    unrender: function () {
        $(this.el).remove();
    },

    item_html: function (item) {
        return item.replace(/\n/g, '<br/>');
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
            return;//nothing
        }

        if (event.target === this.$el.find('span.archive')[0]) {
            this.archive();
            this.isEdit = false;
            return;//nothing
        }

        if (!this.isEdit) {
            this.isEdit = true;
            this.$el.find('p').hide();
            this.$el.find('span').show();
            this.$el.find('select').show();
            this.$el.find('textarea[name="question"]').show().val(this.model.get('question')).autosize({append: ""});
            this.$el.find('textarea[name="answer"]').show().val(this.model.get('answer')).autosize({append: ""});
            //this.$el.find('textarea[name="explain"]').show().val(this.model.get('explain')).autosize({append: ""});
        }

        this.doLayout();
    },


    remove: function () {
        this.model.destroy();
    },

    cancel: function () {
        this.showList();
        this.doLayout();
    },

    showList: function () {
        this.$el.find('span.cancel').hide();
        this.$el.find('span.archive').hide();
        this.$el.find('span.save').hide();
        this.$el.find('select').hide();
        this.$el.find('textarea').hide();
        this.$el.find('p').show();
    },

    save: function () {
        this.showList();

        var sync_state = this.model.get('sync_state');
        var type = this.$el.find('select').val();

        this.model.set({
            type: type,
            type_id: this.get_type_id(type),
            question: this.$el.find('textarea[name="question"]').val(),
            answer: this.$el.find('textarea[name="answer"]').val(),
            explain: this.$el.find('textarea[name="explain"]').val(),
            sync_state: (sync_state === '' ? 'modify' : sync_state),
            devMode: devMode
        });

        var url = '/api/memo/save-item';

        if (devMode) {
            url = 'http://dev.tomtalk.net' + url;
        }

        $.post(url, this.model.attributes, function (result) {
            //todo: xx
        }, 'json');

        this.doLayout();
    },

    archive: function () {
        this.showList();
        this.$el.hide();

        var type = this.$el.find('select').val();
        var now = new Date().getTime();

        this.model.set({
            type_id: this.get_type_id(type),
            mtime: parseInt((now / 1000) - (3600 * 24 * 10)),
            devMode: devMode
        });

        var url = '/api/memo/save-item';

        if (devMode) {
            url = 'http://dev.tomtalk.net' + url;
        }

        $.post(url, this.model.attributes, function (result) {
            //todo: xx
        }, 'json');

        this.doLayout();
    },

    get_type_id: function (type) {
        var types = content_view.types;
        var type_id = 0;

        _(types).each(function (item) {
            if (item.type === type) {
                type_id = item.type_id;
            }
        });

        return type_id;
    },

    doLayout: function () {
        content_view.isoArrange();
    }
});

var List = Backbone.Collection.extend({ model: Item });

//end file
