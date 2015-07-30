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
			this.$form.addEventListener("blur", this.blurHandler.bind(this), true );
			this.$form.addEventListener("input", this.inputHandler.bind(this), true);
			this.$form.addEventListener("focus", this.focusHandler.bind(this), true);
			this.$form.addEventListener("submit", this.submitValidation.submtValidate.bind(this));
		},
		blurHandler: function(e) {
			// start validation
			var func = this.validation.validate.bind(this); func(e);
			// check, if textarea full of spacebars
			this.letterCounter.isFullOfSpaces(e);
		},
		inputHandler: function(e) {
			// control label animation
			this.animation.moveLable(e);
			// show length of message in textarea
			this.letterCounter.isTextarea(e);
			// remove error class for fields when input starts
			this.errorControl.removeError(e);
			// textarea-auto expand control
			this.autoExpand.isTextarea(e);
		},
		focusHandler: function(e) {
			// get base scroll height for textarea auto-expand
			this.autoExpand.isTextarea(e);
		},
		validation: {
			states: {
				name: false,
				company: true,
				email: false,
				"email-confirm": false,
				skype: true,
				message: false
			},
			ruleRegx: {
				textRule: /^[a-zA-Z0-9_-]{3,30}$/,
				companyRule: /^[a-zA-Z0-9_\s-]{3,30}$/,
				emailRule: /[a-z0-9!#$%&/'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
			},
			validate: function(e) {
				var el = e.target,
					path = this.validation;

				switch (el) {
					case this.$name : path.validateName(el); break;
					case this.$company : path.validateCompany(el); break;
					case this.$email : path.validateEmail(el); break;
					case this.$emailConf : path.confirmEmail(el, this.$email); break;
					case this.$skype : path.validateSkype(el); break;
					case this.$msg : path.validateMessage(el); break;
				}
			},
			validateName: function(el) {
				var emptyness = this.checkEmpty(el),
					len = this.checkLength(el),
					valid = this.checkTextByRegex(el);

				if ( !emptyness ) {
					this.setError(el, "empty");
					return;
				}

				if ( !len ) {
					this.setError(el, "name-short");
					return;
				}

				if ( !valid ) {
					this.setError(el, "name-regex");
					return;
				}

				this.setValid(el);
			},
			validateCompany: function(el) {
				if ( el.value !== "" ) {
					this.startCompanyValidation(el);
				} else {
					formControl.errorControl.removeErOrValid(el);
				}
			},
			startCompanyValidation: function(el) {
				var emptyness = this.checkEmpty(el),
					len = this.checkLength(el),
					valid = this.checkCompanyByRegex(el);

				if ( !emptyness ) {
					this.setError(el, "empty");
					return;
				}

				if ( !len ) {
					this.setError(el, "company-short");
					return;
				}

				if ( !valid ) {
					this.setError(el, "company-regex");
					return;
				}

				this.setValid(el);
			},
			validateEmail: function(el) {
				var emptyness = this.checkEmpty(el),
					valid = this.checkEmailByRegex(el);

				if ( !emptyness ) {
					this.setError(el, "empty");
					return;
				} else if ( !valid ) {
					this.setError(el, "mail-regex");
					return;
				}

				this.setValid(el);
			},
			confirmEmail: function(el, email) {
				var emptyness = this.checkEmpty(el),
					confirm  = this.matchFields(email, el);

				if ( !this.checkEmpty(email) ) {
					this.setError(el, "mail-empty");
					return;
				}

				if ( formControl.validation.states.email === false ) {
					this.setError(el, "mail-incorrect");
					return;
				}

				if ( !emptyness ) {
					this.setError(el, "empty");
					return;
				} else if ( !confirm ) {
					this.setError(el, "emails-not-match");
					return;
				}

				this.setValid(el);
			},
			validateSkype: function(el) {
				if ( el.value !== "" ) {
					this.startSkypeValidation(el);
				} else {
					formControl.errorControl.removeErOrValid(el);
				}
			},
			startSkypeValidation: function(el) {
				var emptyness = this.checkEmpty(el),
					len = this.checkLength(el),
					valid = this.checkTextByRegex(el);

				if ( !emptyness ) {
					this.setError(el, "empty");
					return;
				}

				if ( !len ) {
					this.setError(el, "skype-short");
					return;
				}

				if ( !valid ) {
					this.setError(el, "skype-regex");
					return;
				}

				this.setValid(el);
			},
			validateMessage: function( el ) {
				var emptyness = this.checkEmpty(el);

				if ( !emptyness ) {
					this.setError(el, "empty");
					return;
				}

				this.setValid(el);
			},
			matchFields: function(el1, el2) {
				return ( el1.value === el2.value ) ? true : false;
			},
			checkEmpty: function(el) {
				return ( +el.value === 0 ) ? false : true;
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
			},
			checkTextByRegex: function(el) {
				return this.ruleRegx.textRule.test(el.value);
			},
			checkCompanyByRegex: function(el) {
				return this.ruleRegx.companyRule.test(el.value);
			},
			setState: function(el, state) {
				var id = el.id;
				this.states[id] = state;
			},
			checkLength: function(el) {
				return ( el.value.length >= 3 ) ? true : false;
			},
			setError: function(el, error) {
				formControl.errorControl.showError(el, error);
				this.setState(el, false);
			},
			setValid: function(el) {
				formControl.validControl.showValid(el);
				this.setState(el, true);
			}

		},
		errorControl: {
			errors: {
				empty: "This field have to be filled",
				"name-short": "Name is too short. At least 3 symbols",
				"name-regex": "Name isn't valid.",
				"company-short": "Company name is too short. 3 symbols min",
				"company-regex": "Company name isn't valid.",
				"mail-regex": "Email is written incorrectly.",
				"mail-empty": "Previous email filed is empty",
				"mail-incorrect": "Previous email is incorrectly written",
				"emails-not-match": "Emails aren't match to each other",
				"skype-regex": "Skype-nickname isn't valid.",
				"skype-short": "Skype-nikename is too short. 3 symbols min"
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
		// validation on submit
		submitValidation: {
			submtValidate: function(e) {

				this.submitValidation.valName(this.$name);
				this.submitValidation.valCompany(this.$company);
				this.submitValidation.valEmail(this.$email);
				this.submitValidation.confEmail(this.$emailConf, this.$email);
				this.submitValidation.valSkype(this.$skype);
				this.submitValidation.valMsg(this.$msg);

				this.submitValidation.isValid(e);
			},
			valName: function(el) {
				formControl.validation.validateName(el);
			},
			valCompany: function(el) {
				formControl.validation.validateCompany(el);
			},
			valEmail: function(el) {
				formControl.validation.validateEmail(el);
			},
			confEmail: function(el1, el2) {
				formControl.validation.confirmEmail(el1, el2);
			},
			valSkype: function(el) {
				formControl.validation.validateSkype(el);
			},
			valMsg: function(el) {
				formControl.validation.validateMessage(el);
			},
			isValid: function(e) {
				var obj = formControl.validation.states,
					key;

				for ( key in obj ) {
					if ( obj[key] === false ) {
						e.preventDefault();
						this.focusInvalidElem(key);
						return;
					}
				}
			},
			focusInvalidElem: function(id) {
				document.querySelector("#" + id).focus();
			}
		},
		// symbol counter for textarea
		letterCounter: {
			maxLength: 0,
			cls: "msg-length",
			msgElem: null,
			pr: null,
			state: true,
			isTextarea: function(e) {
				var el = e.target;

				if ( el.tagName !== "TEXTAREA" ) { return; }

				if ( this.state ) {
					this.init(el);
				}

				this.getMsgLength(el, e);

			},
			init: function(el) {
				this.pr = el.parentElement;
				this.maxLength = el.getAttribute("maxlength");
				this.state = false;
			},
			getMsgLength: function(el, e) {
				var val = el.value,
					l = val.length,
					str = l + "/" + this.maxLength,
					state = this.isExist();



				if ( state && val === "" ) {
					this.removeMsgLength();

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
			removeMsgLength: function() {
				this.pr.removeChild(this.msgElem);

				this.msgElem = null;
			},
			isFullOfSpaces: function(e) {
				var el = e.target;

				if ( el.tagName === "TEXTAREA" && +el.value === 0 ) {
					if (this.isExist()) {
						this.removeMsgLength();
					}
				}
			}
		},
		// textarea auto-exapnd
		autoExpand: {
			baseScrollHeight: 0,
			baseRows: 0,
			state: true,
			isTextarea: function(e) {
				var el = e.target;

				if ( el.tagName !== "TEXTAREA" ) { return; }

				if ( e.type === "focus" ) {
					if ( !this.state ) { return; }

					this.init(el);

				} else if ( e.type === "input" ) {
					this.setNewHeight(el);
				}
			},
			init: function(el) {
				this.getBaseScrollHeight(el);
				this.getBaseRows(el);
				this.state = false;
			},
			getBaseScrollHeight: function(el) {
				// we get base scroll height just once
				this.baseScrollHeight = el.scrollHeight;
			},
			getBaseRows: function(el) {
				// in data-nin-row we set the same amout of rows like in rows attribute
				// but data one is unchangeble
				this.baseRows = +el.getAttribute("data-min-rows");
			},
			setNewHeight: function(el) {
				var rows;

				// every time we set base height; that's why,
				// if some text have been deleted, we'll see
				// that scroll height decreased; because of that
				// amount as rows will decrease as well
				el.setAttribute("rows", this.baseRows);

				rows = +Math.ceil( (el.scrollHeight - this.baseScrollHeight) / 25 );

				el.setAttribute("rows", rows + this.baseRows);
			}
		}
	};


	formControl.init();

})();