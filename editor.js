class Editor {

    /**
     * [constructor description]
     * @param  {Object} options [description]
     */
    constructor(options) {  
        this.template = options.template; 
        this.originalTemplate = options.originalTemplate;
        this.card = options.context;
        this.isEditing = false;
        this.data = options.data;
        this.element = options.element;
        this.textTemplate = '';
        this.id = options.id;
        this.setTemplate(options.template);
    }





    /**
     * [setTemplate description]
     * @chainable
     * @param {Function} template [description]
     */
    setTemplate(template) {
        this.template = template;
        return this;
    }





    /**
     * [getTemplate description]
     * @return {String} [description]
     */
    getTemplate() {
        return this.template;
    }




    /**
     * [renderTemplate description]
     * @param  {} data [description]
     * @return {[type]}      [description]
     */
    renderTemplate(data) {
        return this.template(data);
    }




    /**
     * [enterEditMode description]
     * @chainable
     * @return {[type]} [description]
     */
    enterEditMode() {
        var form = this.renderTemplate(this.data);
        this.element.innerHTML = form;
        this.element.children[0].innerHTML = this.renderDefaultTemplate(this.data) + this.element.children[0].innerHTML;
        this.addListeners();
        this.isEditing = true;
        return this;
    }





    /**
     * [renderDefaultTemplate description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    renderDefaultTemplate(data) {
        return this.originalTemplate(data);
    }





    /**
     * [revert description]
     * @chainable
     * @return {Object} [description]
     */
    revert() {


        this.element.outerHTML = this.renderDefaultTemplate(this.data);
       // events.emit('update', [], this.card);
        return this;
    }




    /**
     * [update description]
     * @chainable
     * @return {Object} [description]
     */
    update() {
        var form = this.element.getElementsByTagName('form')[0];
        this.data = ___.formatFormData(new FormData(this.element.getElementsByTagName('form')[0]));
        this.element.outerHTML = this.renderDefaultTemplate(this.data);
        events.emit('update', [], this.card);
        return this;
    }




    /**
     * [delete description]
     * @chainable
     * @return {Object} [description]
     */
    delete() {
        var form = this.element.getElementsByTagName('form')[0];
        var data = new FormData(form);

        for (var value of data) {
            this.data[value[0]] = '';
        }

        this.element.outerHTML = this.renderDefaultTemplate(this.data);
        return this;


    }



        /**
         * [addListeners description]
         * @
     * @todo  move listeners to html
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
        return this;
    }



    /**
     * [onsave description]
     * @return {Function} [description]
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