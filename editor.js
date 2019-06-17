class Editor {

    constructor(options) {  
 
        this.templateName = !options.editorTemplateName ? this.templateName : 'default'; 
        this.originalTemplateName = options.originalTemplateName;
        this.card = options.context;
        this.isEditing = false;
        this.data = options.data;
        this.element = options.element;
        this.textTemplate = '';
        this.id = options.id;
        this.setTemplate();
    }
    
    /**
     * [setTemplate description]
     */
    setTemplate() {
        this.template = editorTemplates[this.templateName];
        return this;
    }

    /**
     * [getTemplate description]
     * @return {[type]} [description]
     */
    getTemplate() {
        return this.template;
    }
    
    /**
     * [renderTemplate description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    renderTemplate(data) {
        return this.template(data);
    }

    /**
     * 
     * @param  {Object} data
     * @return {String}
     */
    createEditingElementFragment(data) {
        var fragment = document.createDocumentFragment('<' + data.replaceWith + ' />');
            fragment.dataset = data;
            fragment.placeholder = data.content;

            var html = editorTemplates['formElement'](data);
            return html;
    }

    /**
     * [enterEditMode description]
     * @return {[type]} [description]
     */
    enterEditMode() {
        var form = this.renderTemplate(this.data);
        this.element.innerHTML = form;
        this.element.children[0].innerHTML = this.createEditingElementFragment(this.data) + this.element.children[0].innerHTML;
        this.addListeners();
        this.isEditing = true;
    }

    /**
     * [renderDefaultTemplate description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    renderDefaultTemplate(data) {
        var template = templates[this.originalTemplateName];
        return template(data);
    }

    /**
     * [revert description]
     * @return {[type]} [description]
     */
    revert() {


        this.element.outerHTML = this.renderDefaultTemplate(this.data);
       // events.emit('update', [], this.card);
        return this;
    }

    /**
     * [update description]
     * @return {[type]} [description]
     */
    update() {
        var form = this.element.getElementsByTagName('form')[0];
        this.data = ___.formatFormData(new FormData(this.element.getElementsByTagName('form')[0]));
        this.element.outerHTML = this.renderDefaultTemplate(this.data);
        events.emit('update', [], this.card);
    }
    
    /**
     * [delete description]
     * @return {[type]} [description]
     */
    delete() {
        var form = this.element.getElementsByTagName('form')[0];
        var data = new FormData(form);

        for (var value of data) {
            this.data[value[0]] = '';
        }

        this.element.outerHTML = this.renderDefaultTemplate(this.data);
       // events.emit('update', [], this.card);

    }
    
    /**
     * [addListeners description]
     */
    addListeners() {
        var buttons = Array.prototype.slice.call(this.element.getElementsByTagName('button'));

        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', (event) => {
                event.preventDefault();
                var data = event.target.dataset;
                this['on' + data.action]();
            })
        }
    }

    /**
     * [onsave description]
     * @return {[type]} [description]
     */
    onsave() {
        return this.update()
    }

    /**
     * [ondelete description]
     * @return {[type]} [description]
     */
    ondelete() {
        return this.delete()
    }

    /**
     * [oncancel description]
     * @return {[type]} [description]
     */
    oncancel() {
       return  this.revert()
    }

}
