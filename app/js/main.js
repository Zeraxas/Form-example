(function(){

	"use strict";

	var formControl = {
		init: function() {
			this.chacheDom();
			this.bindEvents();
		},
		chacheDom: function() {
			this.$form = document.querySelector("#order-form");
			this.$name = this.$form.name;
			this.$company = this.$form.company;
			this.$email = this.$form.email;
			this.$emailConf = this.$form["email-confirm"];
			this.$phone = this.$form["phone-number"];
			this.$msg = this.$form.message;
			this.$send = this.$form.send;
		},
		bindEvents: function() {
			this.$form.addEventListener("blur", this.validation.validate.bind(this), true );
		},
		validation: {
			validate: function(e) {
				var el = e.target;

				if ( el === this.$name || el === this.$company) {
					if ( el.required ) {
						this.validation.validateText(el);
					} else {
						if ( el.value !== "" ) {
							this.validation.validateText(el);
						} else {
							console.log( "not required" );
						}
					}
				} else if ( el === this.$email || el === this.$emailConf) {
					this.validation.validateEmail(el);
				}
			},
			validateText: function(el) {
				var emptyness = this.checkEmpty(el);

				if ( !emptyness ) {
					formControl.errorControl.showError(el, "empty");
				}
			},
			validateEmail: function(el) {
				var emptyness = this.checkEmpty(el);

				if ( !emptyness ) {
					formControl.errorControl.showError(el, "empty");
				}
			},
			validatePhone: function() {

			},
			matchFields: function() {

			},
			checkEmpty: function(el) {
				var s = ( el.value !== "" ) ? true : false;

				return s;
			}

		},
		errorControl: {
			errors: {
				empty: "This field have to be filled"
			},
			showError: function(el, type) {
				var msg = this.getErrorMsg(type);

				this.setErrorClass(el);
				this.showMsg(msg, el);
			},
			getErrorMsg: function(type) {
				return this.errors[type];
			},
			showMsg: function(msg, el) {
				var elem = this.createErorElem(msg);

				el.parentElement.appendChild(elem);
			},
			setErrorClass: function(el) {
				el.classList.add("error");
			},
			createErorElem: function( msg ){
				var el = document.createElement("p");
				el.innerHTML = msg;
				el.className = "error-msg";

				return el;
			}
		},
		animation: {

		}
	};


	formControl.init();

})();