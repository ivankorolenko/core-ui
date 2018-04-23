import template from '../templates/selectionCell.hbs';

const selectionTypes = {
    all: 'all',
    single: 'single'
};

const classes = {
    CHECKED: 'editor_checked',
    CHECKED_SOME: 'editor_checked_some',
    SELECTED: 'selected',
    DRAGOVER: 'dragover'
};

export default Marionette.View.extend({
    initialize(options) {
        if (options.selectionType === selectionTypes.all) {
            this.collection = options.collection;
            this.selectAllCell = true;
        } else {
            this.collection = options.model.collection;
        }
    },

    template: Handlebars.compile(template),

    templateContext() {
        let index = '';
        if (this.getOption('showRowIndex') && this.model) {
            index = this.model.collection.indexOf(this.model) + 1;
        }
        return {
            draggable: this.getOption('draggable'),
            index
        };
    },

    className: 'selection-cell-wrp',

    ui: {
        checkbox: '.js-checkbox',
        dots: '.js-dots',
        index: '.js-index'
    },

    events: {
        'click @ui.checkbox': '__handleClick',
        'dragstart @ui.dots': '__handleDragStart',
        'dragend @ui.dots': '__handleDragEnd',
        dragover: '__handleDragOver',
        dragleave: '__handleDragLeave',
        drop: '__handleDrop'
    },

    modelEvents: {
        'update:top': '__updateTop',
        selected: '__handleSelection',
        deselected: '__handleDeselection',
        dragover: '__handleModelDragOver',
        dragleave: '__handleModelDragLeave',
        drop: '__handleModelDrop'
    },

    onRender() {
        this.__updateState();
        // todo: release it by stylesheet?
        if (this.options.showRowIndex) {
            this.el.classList.add('grid-selection-index');
        }
        if (this.getOption('selectionType') === selectionTypes.all) {
            this.listenTo(this.collection, 'check:all check:none check:some', this.__updateState);
            this.listenTo(this.collection, 'dragover:head', this.__handleModelDragOver);
            this.listenTo(this.collection, 'dragleave:head', this.__handleModelDragLeave);
            this.listenTo(this.collection, 'drop:head', this.__handleModelDrop);
        } else {
            this.listenTo(this.model, 'checked unchecked checked:some', this.__updateState);
        }
    },

    __handleClick() {
        if (this.selectAllCell) {
            this.collection.toggleCheckAll();
        } else {
            this.model.toggleChecked();
        }
    },

    __handleDragStart() {
        this.collection.dragginModel = this.model;
    },

    __handleDragEnd() {
        delete this.collection.dragginModel;
    },

    __handleDragOver(event) {
        if (!this.collection.dragginModel) {
            return;
        }
        if (this.selectAllCell) {
            this.collection.trigger('dragover:head', event);
        } else {
            this.model.trigger('dragover', event);
        }
        event.preventDefault();
    },

    __handleModelDragOver() {
        this.el.classList.add(classes.DRAGOVER);
    },

    __handleDragLeave(event) {
        if (this.selectAllCell) {
            this.collection.trigger('dragleave:head', event);
        } else {
            this.model.trigger('dragleave', event);
        }
    },

    __handleModelDragLeave() {
        this.el.classList.remove(classes.DRAGOVER);
    },

    __handleDrop(event) {
        if (this.selectAllCell) {
            this.collection.trigger('drop:head', event);
        } else {
            this.model.trigger('drop', event);
        }
    },

    __handleModelDrop() {
        this.el.classList.remove(classes.DRAGOVER);
        if (this.collection.dragginModel) {
            this.trigger('drag:drop', this.collection.dragginModel, this.model);
        }
    },

    __updateTop(top) {
        requestAnimationFrame(() => {
            this.el.style.top = top;
            if (this.getOption('showRowIndex') && this.model) {
                const index = this.model.collection.indexOf(this.model) + 1;
                this.ui.index.text(index);
            }
        });
    },

    __handleSelection() {
        this.ui.checkbox.addClass(classes.SELECTED);
    },

    __handleDeselection() {
        this.ui.checkbox.removeClass(classes.SELECTED);
    },

    __updateState() {
        let state;
        if (this.selectAllCell) {
            state = this.collection.checkedLength ? (this.collection.checkedLength === this.collection.length ? true : null) : false;
        } else {
            state = this.model.checked;
        }
        if (state) {
            this.ui.checkbox.addClass(classes.CHECKED);
            this.ui.checkbox.removeClass(classes.CHECKED_SOME);
        } else if (state === null) {
            this.ui.checkbox.removeClass(classes.CHECKED);
            this.ui.checkbox.addClass(classes.CHECKED_SOME);
        } else {
            this.ui.checkbox.removeClass(classes.CHECKED);
            this.ui.checkbox.removeClass(classes.CHECKED_SOME);
        }
    }
});
