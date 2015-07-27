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
			this.$skype = this.$form.skype;
			this.$msg = this.$form.message;
			this.$send = this.$form.send;
		},
		bindEvents: function() {
			this.$form.addEventListener("blur", this.validation.validate.bind(this), true );
			this.$form.addEventListener("input", this.inputHandler.bind(this), true);
		},
		inputHandler: function(e) {
			// control label animation
			this.animation.moveLable(e);
			// show length of message in textarea
			this.letterCounter.isTextarea(e);
			// remove error class for fields when input starts
			this.errorControl.removeError(e);
		},
		validation: {
			ruleRegx: {
				emailRule: /[a-z0-9!#$%&/'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
			},
			validate: function(e) {
				var el = e.target;

				if ( el === this.$name || el === this.$msg ) {
					this.validation.validateText(el);

				} else if ( el === this.$email) {
					this.validation.validateEmail(el);

				} else if ( el === this.$company || el === this.$skype ) {
					if ( el.value !== "" ) {
						this.validation.validateText(el);
					} else {
						this.errorControl.removeErOrValid(el);
					}

				} else if ( el === this.$emailConf ) {
					this.validation.confirmEmail(el);
				}
			},
			validateText: function(el) {
				var emptyness = this.checkEmpty(el);

				if ( !emptyness ) {
					formControl.errorControl.showError(el, "empty");
					return;
				}

				formControl.validControl.showValid(el);
			},
			validateEmail: function(el) {
				var emptyness = this.checkEmpty(el),
					valid = this.checkEmailByRegex(el);

				if ( !emptyness ) {
					formControl.errorControl.showError(el, "empty");
					return;
				} else if ( !valid ) {
					formControl.errorControl.showError(el, "mail-error");
					return;
				}

				formControl.validControl.showValid(el);
			},
			confirmEmail: function(el) {
				var emptyness = this.checkEmpty(el),
					confirm  = this.matchFields(formControl.$email, formControl.$emailConf);

				if ( !emptyness ) {
					formControl.errorControl.showError(el, "empty");
					return;
				} else if ( !confirm ) {
					formControl.errorControl.showError(el, "emails-not-match");
					return;
				}

				formControl.validControl.showValid(el);
			},
			matchFields: function(el1, el2) {
				var v1 = el1.value,
					v2 = el2.value;

				if ( v1 === v2 ) {
					return true;
				} else {
					return false;
				}
			},
			checkEmpty: function(el) {
				var s = ( el.value !== "" ) ? true : false;

				return s;
			},
			checkEmailByRegex: function(el) {
				var email = el.value,
					r = email.match(this.ruleRegx.emailRule);

				if ( r === null ) {
					return false;
				} else if ( email !== r[0] ) {
					return false;
				} else {
					return true;
				}
			}

		},
		errorControl: {
			errors: {
				empty: "This field have to be filled",
				"mail-error": "Problems with email",
				"emails-not-match": "Emails not match to each other"
			},
			showError: function(el, type) {
				var st = this.isErAlreadyExist(el,type),
					msg = this.getErrorMsg(type);

				if ( st ) {
					console.log( "already exist" );
					this.changeErMsg(el, msg);
				} else {
					this.setErrorClass(el);
					this.showMsg(msg, el, type);
				}

			},
			getErrorMsg: function(type) {
				return this.errors[type];
			},
			showMsg: function(msg, el, type) {
				var elem = this.createErorElem(msg, type);

				el.parentElement.appendChild(elem);
			},
			setErrorClass: function(el) {
				el.classList.remove("valid");
				el.classList.add("error");
			},
			createErorElem: function( msg, type ) {
				var elen = document.createElement("p"),
					atr = "data-" + type;

				elen.innerHTML = msg;
				elen.className = "error-msg";
				elen.setAttribute("data-err", type);

				return elen;
			},
			isErAlreadyExist: function(el, type) {
				var elem = this.getErrorElem(el),
					state = ( elem !== null ) ? true : false;

				return state;
			},
			changeErMsg: function(el, msg) {
				var elem = this.getErrorElem(el);

				elem.innerHTML = msg;
			},
			removeErOrValid: function(el) {
				el.classList.remove("error");
				el.classList.remove("valid");
			},
			removeError: function(e) {
				var el = e.target,
					elem = this.getErrorElem(el);

				if ( elem === null ) { return; }

				el.classList.remove("error");
				el.parentElement.removeChild(elem);
			},
			getErrorElem: function(el) {
				var p = el.parentElement,
					elem = p.querySelector(".error-msg");

				return elem;
			}
		},
		validControl: {
			showValid: function(el) {
				var elem = formControl.errorControl.getErrorElem(el);

				if ( elem ) {
					el.parentElement.removeChild(elem);
				}

				el.classList.remove("error");
				el.classList.add("valid");
			}
		},
		animation: {
			moveLable: function(e) {
				var el = e.target,
					elem = this.getClosestLabel(el);

				if ( el.value !== "" ) {
					elem.classList.add("form-label-small");
				} else {
					elem.classList.remove("form-label-small");
				}
			},
			getClosestLabel: function(el) {
				var p = el.parentElement,
					elem = p.querySelector(".form-label");

				return elem;
			}
		},
		letterCounter: {
			maxLength: 0,
			cls: "msg-length",
			msgElem: null,
			pr: null,
			state: true,
			init: function(el) {
				this.pr = el.parentElement;
				this.maxLength = el.getAttribute("maxlength");
			},
			isTextarea: function(e) {
				var el = e.target;

				if ( el.tagName === "TEXTAREA" ) {
					if ( this.state ) {
						this.init(el);
						this.state = false;
					}
					this.getMsgLength(el, e);
				}
			},
			getMsgLength: function(el, e) {
				var val = el.value,
					l = val.length,
					str = l + "/" + this.maxLength,
					state = this.isExist();

				if ( state && val === "" ) {
					this.removeMsgLength(el);

					return;

				} else if ( l <= this.maxLength ) {
					this.showMsgLength(el, str, state);
				}
			},
			showMsgLength: function(el, str, state) {
				var elem;

				if ( state ) {
					this.changeMsgLength(str);
				} else {
					this.createMsgLength(str);

					this.pr.appendChild(this.msgElem);
				}

			},
			createMsgLength: function(str) {
				var elem = document.createElement("p");

				elem.innerHTML = str;
				elem.className = this.cls;

				this.msgElem = elem;
			},
			changeMsgLength: function(str) {
				this.msgElem.innerHTML = str;
			},
			isExist: function() {
				var state = ( this.msgElem !== null ) ? true : false;

				return state;
			},
			removeMsgLength: function(el) {
				this.pr.removeChild(this.msgElem);

				this.msgElem = null;
			}
		}
	};


	formControl.init();

})();