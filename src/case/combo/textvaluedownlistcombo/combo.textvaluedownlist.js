/**
 * @class BI.TextValueDownListCombo
 * @extend BI.Widget
 */
BI.TextValueDownListCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextValueDownListCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-value-down-list-combo",
            height: 30
        });
    },

    _init: function () {
        BI.TextValueDownListCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this._createValueMap();

        var value;
        if(BI.isNotNull(o.value)){
            value = this._digest(o.value);
        }
        this.trigger = BI.createWidget({
            type: "bi.down_list_select_text_trigger",
            height: o.height,
            items: o.items,
            text: o.text,
            value: value
        });

        this.combo = BI.createWidget({
            type: "bi.down_list_combo",
            element: this,
            chooseType: BI.Selection.Single,
            adjustLength: 2,
            height: o.height,
            el: this.trigger,
            value: BI.isNull(value) ? [] : [value],
            items: BI.deepClone(o.items)
        });

        this.combo.on(BI.DownListCombo.EVENT_CHANGE, function () {
            self.setValue(self.combo.getValue()[0].value);
            self.fireEvent(BI.TextValueDownListCombo.EVENT_CHANGE);
        });

        this.combo.on(BI.DownListCombo.EVENT_SON_VALUE_CHANGE, function () {
            self.setValue(self.combo.getValue()[0].childValue);
            self.fireEvent(BI.TextValueDownListCombo.EVENT_CHANGE);
        });
    },

    _createValueMap: function () {
        var self = this;
        this.valueMap = {};
        BI.each(BI.flatten(this.options.items), function (idx, item) {
            if (BI.has(item, "el")) {
                BI.each(item.children, function (id, it) {
                    self.valueMap[it.value] = {value: item.el.value, childValue: it.value};
                });
            } else {
                self.valueMap[item.value] = {value: item.value};
            }
        });
    },

    _digest: function (v) {
        return this.valueMap[v];
    },

    setValue: function (v) {
        v = this._digest(v);
        this.combo.setValue([v]);
        this.trigger.setValue(v);
    },

    getValue: function () {
        var v = this.combo.getValue()[0];
        return [v.childValue || v.value];
    },

    populate: function (items) {
        this.options.items = BI.flatten(items);
        this.combo.populate(items);
        this._createValueMap();
    }
});
BI.TextValueDownListCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_value_down_list_combo", BI.TextValueDownListCombo);