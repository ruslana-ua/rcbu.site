(() => {
    "use strict";
    const modules_flsModules = {};
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            document.addEventListener("click", setSpollerAction);
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerItems = spollersBlock.querySelectorAll("details");
                if (spollerItems.length) spollerItems.forEach((spollerItem => {
                    let spollerTitle = spollerItem.querySelector("summary");
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute("tabindex");
                        if (!spollerItem.hasAttribute("data-open")) {
                            spollerItem.open = false;
                            spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.classList.add("_spoller-active");
                            spollerItem.open = true;
                        }
                    } else {
                        spollerTitle.setAttribute("tabindex", "-1");
                        spollerTitle.classList.remove("_spoller-active");
                        spollerItem.open = true;
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                }));
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("summary") && el.closest("[data-spollers]")) {
                    e.preventDefault();
                    if (el.closest("[data-spollers]").classList.contains("_spoller-init")) {
                        const spollerTitle = el.closest("summary");
                        const spollerBlock = spollerTitle.closest("details");
                        const spollersBlock = spollerTitle.closest("[data-spollers]");
                        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                        const scrollSpoller = spollerBlock.hasAttribute("data-spoller-scroll");
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        if (!spollersBlock.querySelectorAll("._slide").length) {
                            if (oneSpoller && !spollerBlock.open) hideSpollersBody(spollersBlock);
                            !spollerBlock.open ? spollerBlock.open = true : setTimeout((() => {
                                spollerBlock.open = false;
                            }), spollerSpeed);
                            spollerTitle.classList.toggle("_spoller-active");
                            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                            if (scrollSpoller && spollerTitle.classList.contains("_spoller-active")) {
                                const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
                                const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
                                const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-spoller-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
                                window.scrollTo({
                                    top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                                    behavior: "smooth"
                                });
                            }
                        }
                    }
                }
                if (!el.closest("[data-spollers]")) {
                    const spollersClose = document.querySelectorAll("[data-spoller-close]");
                    if (spollersClose.length) spollersClose.forEach((spollerClose => {
                        const spollersBlock = spollerClose.closest("[data-spollers]");
                        const spollerCloseBlock = spollerClose.parentNode;
                        if (spollersBlock.classList.contains("_spoller-init")) {
                            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                            spollerClose.classList.remove("_spoller-active");
                            _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                            setTimeout((() => {
                                spollerCloseBlock.open = false;
                            }), spollerSpeed);
                        }
                    }));
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveBlock = spollersBlock.querySelector("details[open]");
                if (spollerActiveBlock && !spollersBlock.querySelectorAll("._slide").length) {
                    const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                    setTimeout((() => {
                        spollerActiveBlock.open = false;
                    }), spollerSpeed);
                }
            }
        }
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Прокинувся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if (this._dataValue !== "error") {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Йой, не заповнено атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Відкрив попап`);
                } else this.popupLogging(`Йой, такого попапу немає. Перевірте коректність введення. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрив попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && focusedIndex === 0) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    /*!
  * Button visually impaired - v1.0.0 https://bvi.isvek.ru
  * Copyright 2014-2021 Oleg Korotenko <bvi@isvek.ru>.
  * Licensed MIT (https://github.com/veks/button-visually-impaired-javascript/blob/master/LICENSE.md)
  */
    (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, 
        global.isvek = factory());
    })(void 0, (function() {
        "use strict";
        function ownKeys(object, enumerableOnly) {
            var keys = Object.keys(object);
            if (Object.getOwnPropertySymbols) {
                var symbols = Object.getOwnPropertySymbols(object);
                if (enumerableOnly) symbols = symbols.filter((function(sym) {
                    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                }));
                keys.push.apply(keys, symbols);
            }
            return keys;
        }
        function _objectSpread2(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i] != null ? arguments[i] : {};
                if (i % 2) ownKeys(Object(source), true).forEach((function(key) {
                    _defineProperty(target, key, source[key]);
                })); else if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); else ownKeys(Object(source)).forEach((function(key) {
                    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                }));
            }
            return target;
        }
        function _typeof(obj) {
            "@babel/helpers - typeof";
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") _typeof = function(obj) {
                return typeof obj;
            }; else _typeof = function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            return _typeof(obj);
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps) _defineProperties(Constructor.prototype, protoProps);
            if (staticProps) _defineProperties(Constructor, staticProps);
            return Constructor;
        }
        function _defineProperty(obj, key, value) {
            if (key in obj) Object.defineProperty(obj, key, {
                value,
                enumerable: true,
                configurable: true,
                writable: true
            }); else obj[key] = value;
            return obj;
        }
        function _unsupportedIterableToArray(o, minLen) {
            if (!o) return;
            if (typeof o === "string") return _arrayLikeToArray(o, minLen);
            var n = Object.prototype.toString.call(o).slice(8, -1);
            if (n === "Object" && o.constructor) n = o.constructor.name;
            if (n === "Map" || n === "Set") return Array.from(o);
            if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
        }
        function _arrayLikeToArray(arr, len) {
            if (len == null || len > arr.length) len = arr.length;
            for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
            return arr2;
        }
        function _createForOfIteratorHelper(o, allowArrayLike) {
            var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
            if (!it) {
                if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
                    if (it) o = it;
                    var i = 0;
                    var F = function() {};
                    return {
                        s: F,
                        n: function() {
                            if (i >= o.length) return {
                                done: true
                            };
                            return {
                                done: false,
                                value: o[i++]
                            };
                        },
                        e: function(e) {
                            throw e;
                        },
                        f: F
                    };
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            var err, normalCompletion = true, didErr = false;
            return {
                s: function() {
                    it = it.call(o);
                },
                n: function() {
                    var step = it.next();
                    normalCompletion = step.done;
                    return step;
                },
                e: function(e) {
                    didErr = true;
                    err = e;
                },
                f: function() {
                    try {
                        if (!normalCompletion && it.return != null) it.return();
                    } finally {
                        if (didErr) throw err;
                    }
                }
            };
        }
        var runtime = {
            exports: {}
        };
        (function(module) {
            var runtime = function(exports) {
                var Op = Object.prototype;
                var hasOwn = Op.hasOwnProperty;
                var undefined$1;
                var $Symbol = typeof Symbol === "function" ? Symbol : {};
                var iteratorSymbol = $Symbol.iterator || "@@iterator";
                var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
                var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
                function define(obj, key, value) {
                    Object.defineProperty(obj, key, {
                        value,
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                    return obj[key];
                }
                try {
                    define({}, "");
                } catch (err) {
                    define = function define(obj, key, value) {
                        return obj[key] = value;
                    };
                }
                function wrap(innerFn, outerFn, self, tryLocsList) {
                    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
                    var generator = Object.create(protoGenerator.prototype);
                    var context = new Context(tryLocsList || []);
                    generator._invoke = makeInvokeMethod(innerFn, self, context);
                    return generator;
                }
                exports.wrap = wrap;
                function tryCatch(fn, obj, arg) {
                    try {
                        return {
                            type: "normal",
                            arg: fn.call(obj, arg)
                        };
                    } catch (err) {
                        return {
                            type: "throw",
                            arg: err
                        };
                    }
                }
                var GenStateSuspendedStart = "suspendedStart";
                var GenStateSuspendedYield = "suspendedYield";
                var GenStateExecuting = "executing";
                var GenStateCompleted = "completed";
                var ContinueSentinel = {};
                function Generator() {}
                function GeneratorFunction() {}
                function GeneratorFunctionPrototype() {}
                var IteratorPrototype = {};
                define(IteratorPrototype, iteratorSymbol, (function() {
                    return this;
                }));
                var getProto = Object.getPrototypeOf;
                var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
                if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) IteratorPrototype = NativeIteratorPrototype;
                var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
                GeneratorFunction.prototype = GeneratorFunctionPrototype;
                define(Gp, "constructor", GeneratorFunctionPrototype);
                define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
                GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction");
                function defineIteratorMethods(prototype) {
                    [ "next", "throw", "return" ].forEach((function(method) {
                        define(prototype, method, (function(arg) {
                            return this._invoke(method, arg);
                        }));
                    }));
                }
                exports.isGeneratorFunction = function(genFun) {
                    var ctor = typeof genFun === "function" && genFun.constructor;
                    return ctor ? ctor === GeneratorFunction || (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
                };
                exports.mark = function(genFun) {
                    if (Object.setPrototypeOf) Object.setPrototypeOf(genFun, GeneratorFunctionPrototype); else {
                        genFun.__proto__ = GeneratorFunctionPrototype;
                        define(genFun, toStringTagSymbol, "GeneratorFunction");
                    }
                    genFun.prototype = Object.create(Gp);
                    return genFun;
                };
                exports.awrap = function(arg) {
                    return {
                        __await: arg
                    };
                };
                function AsyncIterator(generator, PromiseImpl) {
                    function invoke(method, arg, resolve, reject) {
                        var record = tryCatch(generator[method], generator, arg);
                        if (record.type === "throw") reject(record.arg); else {
                            var result = record.arg;
                            var value = result.value;
                            if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) return PromiseImpl.resolve(value.__await).then((function(value) {
                                invoke("next", value, resolve, reject);
                            }), (function(err) {
                                invoke("throw", err, resolve, reject);
                            }));
                            return PromiseImpl.resolve(value).then((function(unwrapped) {
                                result.value = unwrapped;
                                resolve(result);
                            }), (function(error) {
                                return invoke("throw", error, resolve, reject);
                            }));
                        }
                    }
                    var previousPromise;
                    function enqueue(method, arg) {
                        function callInvokeWithMethodAndArg() {
                            return new PromiseImpl((function(resolve, reject) {
                                invoke(method, arg, resolve, reject);
                            }));
                        }
                        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
                    }
                    this._invoke = enqueue;
                }
                defineIteratorMethods(AsyncIterator.prototype);
                define(AsyncIterator.prototype, asyncIteratorSymbol, (function() {
                    return this;
                }));
                exports.AsyncIterator = AsyncIterator;
                exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
                    if (PromiseImpl === void 0) PromiseImpl = Promise;
                    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
                    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then((function(result) {
                        return result.done ? result.value : iter.next();
                    }));
                };
                function makeInvokeMethod(innerFn, self, context) {
                    var state = GenStateSuspendedStart;
                    return function invoke(method, arg) {
                        if (state === GenStateExecuting) throw new Error("Generator is already running");
                        if (state === GenStateCompleted) {
                            if (method === "throw") throw arg;
                            return doneResult();
                        }
                        context.method = method;
                        context.arg = arg;
                        while (true) {
                            var delegate = context.delegate;
                            if (delegate) {
                                var delegateResult = maybeInvokeDelegate(delegate, context);
                                if (delegateResult) {
                                    if (delegateResult === ContinueSentinel) continue;
                                    return delegateResult;
                                }
                            }
                            if (context.method === "next") context.sent = context._sent = context.arg; else if (context.method === "throw") {
                                if (state === GenStateSuspendedStart) {
                                    state = GenStateCompleted;
                                    throw context.arg;
                                }
                                context.dispatchException(context.arg);
                            } else if (context.method === "return") context.abrupt("return", context.arg);
                            state = GenStateExecuting;
                            var record = tryCatch(innerFn, self, context);
                            if (record.type === "normal") {
                                state = context.done ? GenStateCompleted : GenStateSuspendedYield;
                                if (record.arg === ContinueSentinel) continue;
                                return {
                                    value: record.arg,
                                    done: context.done
                                };
                            } else if (record.type === "throw") {
                                state = GenStateCompleted;
                                context.method = "throw";
                                context.arg = record.arg;
                            }
                        }
                    };
                }
                function maybeInvokeDelegate(delegate, context) {
                    var method = delegate.iterator[context.method];
                    if (method === undefined$1) {
                        context.delegate = null;
                        if (context.method === "throw") {
                            if (delegate.iterator["return"]) {
                                context.method = "return";
                                context.arg = undefined$1;
                                maybeInvokeDelegate(delegate, context);
                                if (context.method === "throw") return ContinueSentinel;
                            }
                            context.method = "throw";
                            context.arg = new TypeError("The iterator does not provide a 'throw' method");
                        }
                        return ContinueSentinel;
                    }
                    var record = tryCatch(method, delegate.iterator, context.arg);
                    if (record.type === "throw") {
                        context.method = "throw";
                        context.arg = record.arg;
                        context.delegate = null;
                        return ContinueSentinel;
                    }
                    var info = record.arg;
                    if (!info) {
                        context.method = "throw";
                        context.arg = new TypeError("iterator result is not an object");
                        context.delegate = null;
                        return ContinueSentinel;
                    }
                    if (info.done) {
                        context[delegate.resultName] = info.value;
                        context.next = delegate.nextLoc;
                        if (context.method !== "return") {
                            context.method = "next";
                            context.arg = undefined$1;
                        }
                    } else return info;
                    context.delegate = null;
                    return ContinueSentinel;
                }
                defineIteratorMethods(Gp);
                define(Gp, toStringTagSymbol, "Generator");
                define(Gp, iteratorSymbol, (function() {
                    return this;
                }));
                define(Gp, "toString", (function() {
                    return "[object Generator]";
                }));
                function pushTryEntry(locs) {
                    var entry = {
                        tryLoc: locs[0]
                    };
                    if (1 in locs) entry.catchLoc = locs[1];
                    if (2 in locs) {
                        entry.finallyLoc = locs[2];
                        entry.afterLoc = locs[3];
                    }
                    this.tryEntries.push(entry);
                }
                function resetTryEntry(entry) {
                    var record = entry.completion || {};
                    record.type = "normal";
                    delete record.arg;
                    entry.completion = record;
                }
                function Context(tryLocsList) {
                    this.tryEntries = [ {
                        tryLoc: "root"
                    } ];
                    tryLocsList.forEach(pushTryEntry, this);
                    this.reset(true);
                }
                exports.keys = function(object) {
                    var keys = [];
                    for (var key in object) keys.push(key);
                    keys.reverse();
                    return function next() {
                        while (keys.length) {
                            var key = keys.pop();
                            if (key in object) {
                                next.value = key;
                                next.done = false;
                                return next;
                            }
                        }
                        next.done = true;
                        return next;
                    };
                };
                function values(iterable) {
                    if (iterable) {
                        var iteratorMethod = iterable[iteratorSymbol];
                        if (iteratorMethod) return iteratorMethod.call(iterable);
                        if (typeof iterable.next === "function") return iterable;
                        if (!isNaN(iterable.length)) {
                            var i = -1, next = function next() {
                                while (++i < iterable.length) if (hasOwn.call(iterable, i)) {
                                    next.value = iterable[i];
                                    next.done = false;
                                    return next;
                                }
                                next.value = undefined$1;
                                next.done = true;
                                return next;
                            };
                            return next.next = next;
                        }
                    }
                    return {
                        next: doneResult
                    };
                }
                exports.values = values;
                function doneResult() {
                    return {
                        value: undefined$1,
                        done: true
                    };
                }
                Context.prototype = {
                    constructor: Context,
                    reset: function reset(skipTempReset) {
                        this.prev = 0;
                        this.next = 0;
                        this.sent = this._sent = undefined$1;
                        this.done = false;
                        this.delegate = null;
                        this.method = "next";
                        this.arg = undefined$1;
                        this.tryEntries.forEach(resetTryEntry);
                        if (!skipTempReset) for (var name in this) if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) this[name] = undefined$1;
                    },
                    stop: function stop() {
                        this.done = true;
                        var rootEntry = this.tryEntries[0];
                        var rootRecord = rootEntry.completion;
                        if (rootRecord.type === "throw") throw rootRecord.arg;
                        return this.rval;
                    },
                    dispatchException: function dispatchException(exception) {
                        if (this.done) throw exception;
                        var context = this;
                        function handle(loc, caught) {
                            record.type = "throw";
                            record.arg = exception;
                            context.next = loc;
                            if (caught) {
                                context.method = "next";
                                context.arg = undefined$1;
                            }
                            return !!caught;
                        }
                        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                            var entry = this.tryEntries[i];
                            var record = entry.completion;
                            if (entry.tryLoc === "root") return handle("end");
                            if (entry.tryLoc <= this.prev) {
                                var hasCatch = hasOwn.call(entry, "catchLoc");
                                var hasFinally = hasOwn.call(entry, "finallyLoc");
                                if (hasCatch && hasFinally) {
                                    if (this.prev < entry.catchLoc) return handle(entry.catchLoc, true); else if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
                                } else if (hasCatch) {
                                    if (this.prev < entry.catchLoc) return handle(entry.catchLoc, true);
                                } else if (hasFinally) {
                                    if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
                                } else throw new Error("try statement without catch or finally");
                            }
                        }
                    },
                    abrupt: function abrupt(type, arg) {
                        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                            var entry = this.tryEntries[i];
                            if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                                var finallyEntry = entry;
                                break;
                            }
                        }
                        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) finallyEntry = null;
                        var record = finallyEntry ? finallyEntry.completion : {};
                        record.type = type;
                        record.arg = arg;
                        if (finallyEntry) {
                            this.method = "next";
                            this.next = finallyEntry.finallyLoc;
                            return ContinueSentinel;
                        }
                        return this.complete(record);
                    },
                    complete: function complete(record, afterLoc) {
                        if (record.type === "throw") throw record.arg;
                        if (record.type === "break" || record.type === "continue") this.next = record.arg; else if (record.type === "return") {
                            this.rval = this.arg = record.arg;
                            this.method = "return";
                            this.next = "end";
                        } else if (record.type === "normal" && afterLoc) this.next = afterLoc;
                        return ContinueSentinel;
                    },
                    finish: function finish(finallyLoc) {
                        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                            var entry = this.tryEntries[i];
                            if (entry.finallyLoc === finallyLoc) {
                                this.complete(entry.completion, entry.afterLoc);
                                resetTryEntry(entry);
                                return ContinueSentinel;
                            }
                        }
                    },
                    catch: function _catch(tryLoc) {
                        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                            var entry = this.tryEntries[i];
                            if (entry.tryLoc === tryLoc) {
                                var record = entry.completion;
                                if (record.type === "throw") {
                                    var thrown = record.arg;
                                    resetTryEntry(entry);
                                }
                                return thrown;
                            }
                        }
                        throw new Error("illegal catch attempt");
                    },
                    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
                        this.delegate = {
                            iterator: values(iterable),
                            resultName,
                            nextLoc
                        };
                        if (this.method === "next") this.arg = undefined$1;
                        return ContinueSentinel;
                    }
                };
                return exports;
            }(module.exports);
            try {
                regeneratorRuntime = runtime;
            } catch (accidentalStrictMode) {
                if ((typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) === "object") globalThis.regeneratorRuntime = runtime; else Function("r", "regeneratorRuntime = r")(runtime);
            }
        })(runtime);
        (function(arr) {
            arr.forEach((function(item) {
                if (item.hasOwnProperty("prepend")) return;
                Object.defineProperty(item, "prepend", {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: function prepend() {
                        var argArr = Array.prototype.slice.call(arguments), docFrag = document.createDocumentFragment();
                        argArr.forEach((function(argItem) {
                            var isNode = argItem instanceof Node;
                            docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                        }));
                        this.insertBefore(docFrag, this.firstChild);
                    }
                });
            }));
        })([ Element.prototype, Document.prototype, DocumentFragment.prototype ]);
        if (window.NodeList && !NodeList.prototype.forEach) NodeList.prototype.forEach = Array.prototype.forEach;
        if (window.HTMLCollection && !HTMLCollection.prototype.forEach) HTMLCollection.prototype.forEach = Array.prototype.forEach;
        var toType = function toType(obj) {
            if (obj === null || obj === void 0) return "".concat(obj);
            return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
        };
        var isElement = function isElement(obj) {
            if (!obj || _typeof(obj) !== "object") return false;
            return typeof obj.nodeType !== "undefined";
        };
        var checkConfig = function checkConfig(config, configTypes, configOptions) {
            Object.keys(configTypes).forEach((function(key) {
                var expectedTypes = configTypes[key];
                var value = config[key];
                var valueType = value && isElement(value) ? "element" : toType(value);
                if (!new RegExp(expectedTypes).test(valueType)) throw new TypeError('Bvi console: Опция "'.concat(key, '" предоставленный тип "').concat(valueType, '", ожидаемый тип "').concat(expectedTypes, '".'));
            }));
            Object.keys(configOptions).forEach((function(key) {
                var expectedOptions = configOptions[key];
                var value = config[key];
                if (!new RegExp(expectedOptions).test(value)) throw new TypeError('Bvi console: Опция "'.concat(key, '" параметр "').concat(value, '", ожидаемый параметр "').concat(expectedOptions, '".'));
            }));
        };
        var stringToBoolean = function stringToBoolean(string) {
            switch (string) {
              case "on":
              case "true":
              case "1":
                return true;

              default:
                return false;
            }
        };
        var wrapInner = function wrapInner(parent, wrapper, className) {
            if (typeof wrapper === "string") wrapper = document.createElement(wrapper);
            parent.appendChild(wrapper).className = className;
            while (parent.firstChild !== wrapper) wrapper.appendChild(parent.firstChild);
        };
        var unwrap = function unwrap(wrapper) {
            var docFrag = document.createDocumentFragment();
            if (!wrapper) return;
            while (wrapper.firstChild) {
                var child = wrapper.removeChild(wrapper.firstChild);
                docFrag.appendChild(child);
            }
            wrapper.parentNode.replaceChild(docFrag, wrapper);
        };
        var getObject = function getObject(object, callback) {
            Object.keys(object).forEach((function(key) {
                if (typeof callback === "function") callback(key);
            }));
        };
        var getArray = function getArray(array, callback) {
            Array.from(array).forEach((function(key) {
                if (typeof callback === "function") callback(key);
            }));
        };
        var synth = function synth() {
            return window.speechSynthesis;
        };
        var setCookie = function setCookie() {
            var name = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
            var value = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
            var now = new Date;
            var time = now.getTime();
            time += 24 * 60 * 60 * 1e3;
            now.setTime(time);
            document.cookie = "bvi_".concat(name, "=").concat(value, ";path=/;expires=").concat(now.toUTCString(), ";domain=").concat(location.host);
        };
        var getCookie = function getCookie() {
            var name = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
            name = "bvi_".concat(name, "=");
            var decodedCookie = decodeURIComponent(document.cookie);
            var cookies = decodedCookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.indexOf(name) !== -1) return cookie.substring(name.length, cookie.length);
            }
        };
        var removeCookie = function removeCookie() {
            var name = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
            document.cookie = "bvi_".concat(name, "=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=").concat(location.host);
        };
        var lang = {
            "ru-RU": {
                text: {
                    fontSize: "Размер шрифта",
                    siteColors: "Цвета сайта",
                    images: "Изображения",
                    speech: "Синтез речи",
                    settings: "Настройки",
                    regularVersionOfTheSite: "Обычная версия сайта",
                    letterSpacing: "Межбуквенное расстояние",
                    normal: "Стандартный",
                    average: "Средний",
                    big: "Большой",
                    lineHeight: "Межстрочный интервал",
                    font: "Шрифт",
                    arial: "Без засечек",
                    times: "С засечками",
                    builtElements: "Встроенные элементы (Видео, карты и тд.)",
                    on: "Включить",
                    off: "Выключить",
                    reset: "Сбросить настройки",
                    plural_0: "пиксель",
                    plural_1: "пекселя",
                    plural_2: "пикселей"
                },
                voice: {
                    fontSizePlus: "Размер шрифта увели́чен",
                    fontSizeMinus: "Размер шрифта уме́ньшен",
                    siteColorBlackOnWhite: "Цвет сайта черным по белому",
                    siteColorWhiteOnBlack: "Цвет сайта белым по черному",
                    siteColorDarkBlueOnBlue: "Цвет сайта тёмно-синим по голубому",
                    siteColorBeigeBrown: "Цвет сайта кори́чневым по бе́жевому",
                    siteColorGreenOnDarkBrown: "Цвет сайта зеленым по тёмно-коричневому",
                    imagesOn: "Изображения включены",
                    imagesOFF: "Изображения выключены",
                    imagesGrayscale: "Изображения чёрно-белые",
                    speechOn: "Синтез речи включён",
                    speechOff: "Синтез речи вы́ключен",
                    lineHeightNormal: "Межстрочный интервал стандартный",
                    lineHeightAverage: "Межстрочный интервал средний",
                    lineHeightBig: "Межстрочный интервал большой",
                    LetterSpacingNormal: "Интервал между буквами стандартный",
                    LetterSpacingAverage: "Интервал между буквами средний",
                    LetterSpacingBig: "Интервал между буквами большой",
                    fontArial: "Шрифт без засечек",
                    fontTimes: "Шрифт с засечками",
                    builtElementsOn: "Встроенные элементы включены",
                    builtElementsOFF: "Встроенные элементы выключены",
                    resetSettings: "Установлены настройки по умолча́нию",
                    panelShow: "Панель открыта",
                    panelHide: "Панель скрыта",
                    panelOn: "Версия сайта для слабови́дящий",
                    panelOff: "Обычная версия сайта"
                }
            },
            "en-US": {
                text: {
                    fontSize: "Font size",
                    siteColors: "Site colors",
                    images: "Images",
                    speech: "Speech synthesis",
                    settings: "Settings",
                    regularVersionOfTheSite: "Regular version Of The site",
                    letterSpacing: "Letter spacing",
                    normal: "Single",
                    average: "One and a half",
                    big: "Double",
                    lineHeight: "Line spacing",
                    font: "Font",
                    arial: "Sans Serif - Arial",
                    times: "Serif - Times New Roman",
                    builtElements: "Include inline elements (Videos, maps, etc.)",
                    on: "Enable",
                    off: "Disabled",
                    reset: "Reset settings",
                    plural_0: "pixel",
                    plural_1: "pixels",
                    plural_2: "pixels"
                },
                voice: {
                    fontSizePlus: "Font size increased",
                    fontSizeMinus: "Font size reduced",
                    siteColorBlackOnWhite: "Site color black on white",
                    siteColorWhiteOnBlack: "Site color white on black",
                    siteColorDarkBlueOnBlue: "Site color dark blue on cyan",
                    siteColorBeigeBrown: "SiteColorBeigeBrown",
                    siteColorGreenOnDarkBrown: "Site color green on dark brown",
                    imagesOn: "Images enable",
                    imagesOFF: "Images disabled",
                    imagesGrayscale: "Images gray scale",
                    speechOn: "Synthesis speech enable",
                    speechOff: "Synthesis speech disabled",
                    lineHeightNormal: "Line spacing single",
                    lineHeightAverage: "Line spacing one and a half",
                    lineHeightBig: "Line spacing double",
                    LetterSpacingNormal: "Letter spacing single",
                    LetterSpacingAverage: "Letter spacing one and a half",
                    LetterSpacingBig: "Letter spacing letter double",
                    fontArial: "Sans Serif - Arial",
                    fontTimes: "Serif - Times New Roman",
                    builtElementsOn: "Include inline elements are enabled",
                    builtElementsOFF: "Include inline elements are disabled",
                    resetSettings: "Default settings have been set",
                    panelShow: "Panel show",
                    panelHide: "Panel hide",
                    panelOn: "Site version for visually impaired",
                    panelOff: "Regular version of the site"
                }
            }
        };
        var I18n = function() {
            function I18n(options) {
                _classCallCheck(this, I18n);
                this._config = options;
            }
            _createClass(I18n, [ {
                key: "t",
                value: function t(key) {
                    return lang[this._config.lang]["text"][key];
                }
            }, {
                key: "v",
                value: function v(key) {
                    return lang[this._config.lang]["voice"][key];
                }
            } ]);
            return I18n;
        }();
        var Default = {
            target: ".bvi-open",
            fontSize: 16,
            theme: "white",
            images: "grayscale",
            letterSpacing: "normal",
            lineHeight: "normal",
            speech: true,
            fontFamily: "arial",
            builtElements: false,
            panelFixed: true,
            panelHide: false,
            reload: false,
            lang: "ru-RU"
        };
        var DefaultType = {
            target: "string",
            fontSize: "number",
            theme: "string",
            images: "(string|boolean)",
            letterSpacing: "string",
            lineHeight: "string",
            speech: "boolean",
            fontFamily: "string",
            builtElements: "boolean",
            panelFixed: "boolean",
            panelHide: "boolean",
            reload: "boolean",
            lang: "string"
        };
        var DefaultOptions = {
            target: "",
            fontSize: "(^[1-9]$|^[1-3][0-9]?$|^39$)",
            theme: "(white|black|blue|brown|green)",
            images: "(true|false|grayscale)",
            letterSpacing: "(normal|average|big)",
            lineHeight: "(normal|average|big)",
            speech: "(true|false)",
            fontFamily: "(arial|times)",
            builtElements: "(true|false)",
            panelFixed: "(true|false)",
            panelHide: "(true|false)",
            reload: "(true|false)",
            lang: "(ru-RU|en-US)"
        };
        var Bvi = function() {
            function Bvi(options) {
                _classCallCheck(this, Bvi);
                this._config = this._getConfig(options);
                this._elements = document.querySelectorAll(this._config.target);
                this._i18n = new I18n({
                    lang: this._config.lang
                });
                this._addEventListeners();
                this._init();
                console.log("Bvi console: ready Button visually impaired v1.0.0");
            }
            _createClass(Bvi, [ {
                key: "_init",
                value: function _init() {
                    getObject(this._config, (function(key) {
                        if (typeof getCookie(key) === "undefined") removeCookie("panelActive");
                    }));
                    if (stringToBoolean(getCookie("panelActive"))) {
                        this._set();
                        this._getPanel();
                        this._addEventListenersPanel();
                        this._images();
                        this._speechPlayer();
                        if ("speechSynthesis" in window && stringToBoolean(getCookie("speech"))) setInterval((function() {
                            if (synth().pending === false) {
                                var play = document.querySelectorAll(".bvi-speech-play");
                                var pause = document.querySelectorAll(".bvi-speech-pause");
                                var resume = document.querySelectorAll(".bvi-speech-resume");
                                var stop = document.querySelectorAll(".bvi-speech-stop");
                                var el = function el(elements, callback) {
                                    elements.forEach((function(element) {
                                        return callback(element);
                                    }));
                                };
                                el(play, (function(element) {
                                    return element.classList.remove("disabled");
                                }));
                                el(pause, (function(element) {
                                    return element.classList.add("disabled");
                                }));
                                el(resume, (function(element) {
                                    return element.classList.add("disabled");
                                }));
                                el(stop, (function(element) {
                                    return element.classList.add("disabled");
                                }));
                            }
                        }), 1e3);
                    } else this._remove();
                }
            }, {
                key: "_addEventListeners",
                value: function _addEventListeners() {
                    var _this = this;
                    if (!this._elements) return false;
                    this._elements.forEach((function(element) {
                        element.addEventListener("click", (function(event) {
                            event.preventDefault();
                            getObject(_this._config, (function(key) {
                                return setCookie(key, _this._config[key]);
                            }));
                            setCookie("panelActive", true);
                            _this._init();
                            _this._speech("".concat(_this._i18n.v("panelOn")));
                        }));
                    }));
                }
            }, {
                key: "_addEventListenersPanel",
                value: function _addEventListenersPanel() {
                    var _this2 = this;
                    var elements = {
                        fontSizeMinus: document.querySelector(".bvi-fontSize-minus"),
                        fontSizePlus: document.querySelector(".bvi-fontSize-plus"),
                        themeWhite: document.querySelector(".bvi-theme-white"),
                        themeBlack: document.querySelector(".bvi-theme-black"),
                        themeBlue: document.querySelector(".bvi-theme-blue"),
                        themeBrown: document.querySelector(".bvi-theme-brown"),
                        themeGreen: document.querySelector(".bvi-theme-green"),
                        imagesOn: document.querySelector(".bvi-images-on"),
                        imagesOff: document.querySelector(".bvi-images-off"),
                        imagesGrayscale: document.querySelector(".bvi-images-grayscale"),
                        speechOn: document.querySelector(".bvi-speech-on"),
                        speechOff: document.querySelector(".bvi-speech-off"),
                        lineHeightNormal: document.querySelector(".bvi-line-height-normal"),
                        lineHeightAverage: document.querySelector(".bvi-line-height-average"),
                        lineHeightBig: document.querySelector(".bvi-line-height-big"),
                        letterSpacingNormal: document.querySelector(".bvi-letter-spacing-normal"),
                        letterSpacingAverage: document.querySelector(".bvi-letter-spacing-average"),
                        letterSpacingBig: document.querySelector(".bvi-letter-spacing-big"),
                        fontFamilyArial: document.querySelector(".bvi-font-family-arial"),
                        fontFamilyTimes: document.querySelector(".bvi-font-family-times"),
                        builtElementsOn: document.querySelector(".bvi-built-elements-on"),
                        builtElementsOff: document.querySelector(".bvi-built-elements-off"),
                        reset: document.querySelector(".bvi-reset"),
                        links: document.querySelectorAll(".bvi-link"),
                        modal: document.querySelector(".bvi-modal")
                    };
                    var activeLink = function activeLink(element) {
                        var _step, _iterator = _createForOfIteratorHelper(element.parentNode.children);
                        try {
                            for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                                var sibling = _step.value;
                                sibling.classList.remove("active");
                            }
                        } catch (err) {
                            _iterator.e(err);
                        } finally {
                            _iterator.f();
                        }
                        element.classList.add("active");
                    };
                    var click = function click(element, callback) {
                        element.addEventListener("click", (function(event) {
                            event.preventDefault();
                            if (typeof callback === "function") callback(event);
                        }));
                    };
                    var activeAll = function activeAll() {
                        var links = document.querySelectorAll(".bvi-link");
                        links.forEach((function(link) {
                            link.classList.remove("active");
                        }));
                        getObject(_this2._config, (function(key) {
                            if (key === "theme") {
                                var value = getCookie(key);
                                document.querySelector(".bvi-theme-".concat(value)).classList.add("active");
                            }
                            if (key === "images") {
                                var _value = getCookie(key) === "grayscale" ? "grayscale" : stringToBoolean(getCookie(key)) ? "on" : "off";
                                document.querySelector(".bvi-images-".concat(_value)).classList.add("active");
                            }
                            if (key === "speech") {
                                var _value2 = stringToBoolean(getCookie(key)) ? "on" : "off";
                                document.querySelector(".bvi-speech-".concat(_value2)).classList.add("active");
                            }
                            if (key === "lineHeight") {
                                var _value3 = getCookie(key);
                                document.querySelector(".bvi-line-height-".concat(_value3)).classList.add("active");
                            }
                            if (key === "letterSpacing") {
                                var _value4 = getCookie(key);
                                document.querySelector(".bvi-letter-spacing-".concat(_value4)).classList.add("active");
                            }
                            if (key === "fontFamily") {
                                var _value5 = getCookie(key);
                                document.querySelector(".bvi-font-family-".concat(_value5)).classList.add("active");
                            }
                            if (key === "builtElements") {
                                var _value6 = stringToBoolean(getCookie(key)) ? "on" : "off";
                                document.querySelector(".bvi-built-elements-".concat(_value6)).classList.add("active");
                            }
                        }));
                    };
                    activeAll();
                    click(elements.fontSizeMinus, (function() {
                        var size = parseFloat(getCookie("fontSize")) - 1;
                        if (size !== 0) {
                            _this2._setAttrDataBviBody("fontSize", size);
                            setCookie("fontSize", size);
                            _this2._speech("".concat(_this2._i18n.v("fontSizeMinus")));
                            activeLink(elements.fontSizeMinus);
                        }
                    }));
                    click(elements.fontSizePlus, (function() {
                        var size = parseFloat(getCookie("fontSize")) + 1;
                        if (size !== 40) {
                            _this2._setAttrDataBviBody("fontSize", size);
                            setCookie("fontSize", size);
                            _this2._speech("".concat(_this2._i18n.v("fontSizePlus")));
                            activeLink(elements.fontSizePlus);
                        }
                    }));
                    click(elements.themeWhite, (function() {
                        _this2._setAttrDataBviBody("theme", "white");
                        setCookie("theme", "white");
                        _this2._speech("".concat(_this2._i18n.v("siteColorBlackOnWhite")));
                        activeLink(elements.themeWhite);
                    }));
                    click(elements.themeBlack, (function() {
                        _this2._setAttrDataBviBody("theme", "black");
                        setCookie("theme", "black");
                        _this2._speech("".concat(_this2._i18n.v("siteColorWhiteOnBlack")));
                        activeLink(elements.themeBlack);
                    }));
                    click(elements.themeBlue, (function() {
                        _this2._setAttrDataBviBody("theme", "blue");
                        setCookie("theme", "blue");
                        _this2._speech("".concat(_this2._i18n.v("siteColorDarkBlueOnBlue")));
                        activeLink(elements.themeBlue);
                    }));
                    click(elements.themeBrown, (function() {
                        _this2._setAttrDataBviBody("theme", "brown");
                        setCookie("theme", "brown");
                        _this2._speech("".concat(_this2._i18n.v("siteColorBeigeBrown")));
                        activeLink(elements.themeBrown);
                    }));
                    click(elements.themeGreen, (function() {
                        _this2._setAttrDataBviBody("theme", "green");
                        setCookie("theme", "green");
                        _this2._speech("".concat(_this2._i18n.v("siteColorGreenOnDarkBrown")));
                        activeLink(elements.themeGreen);
                    }));
                    click(elements.imagesOn, (function() {
                        _this2._setAttrDataBviBody("images", "true");
                        setCookie("images", "true");
                        _this2._speech("".concat(_this2._i18n.v("imagesOn")));
                        activeLink(elements.imagesOn);
                    }));
                    click(elements.imagesOff, (function() {
                        _this2._setAttrDataBviBody("images", "false");
                        setCookie("images", "false");
                        _this2._speech("".concat(_this2._i18n.v("imagesOFF")));
                        activeLink(elements.imagesOff);
                    }));
                    click(elements.imagesGrayscale, (function() {
                        _this2._setAttrDataBviBody("images", "grayscale");
                        setCookie("images", "grayscale");
                        _this2._speech("".concat(_this2._i18n.v("imagesGrayscale")));
                        activeLink(elements.imagesGrayscale);
                    }));
                    click(elements.speechOn, (function() {
                        _this2._setAttrDataBviBody("speech", "true");
                        setCookie("speech", "true");
                        _this2._speech("".concat(_this2._i18n.v("speechOn")));
                        activeLink(elements.speechOn);
                        _this2._speechPlayer();
                    }));
                    click(elements.speechOff, (function() {
                        _this2._speech("".concat(_this2._i18n.v("speechOff")));
                        _this2._setAttrDataBviBody("speech", "false");
                        setCookie("speech", "false");
                        activeLink(elements.speechOff);
                        _this2._speechPlayer();
                    }));
                    click(elements.lineHeightNormal, (function() {
                        _this2._setAttrDataBviBody("lineHeight", "normal");
                        setCookie("lineHeight", "normal");
                        _this2._speech("".concat(_this2._i18n.v("lineHeightNormal")));
                        activeLink(elements.lineHeightNormal);
                    }));
                    click(elements.lineHeightAverage, (function() {
                        _this2._setAttrDataBviBody("lineHeight", "average");
                        setCookie("lineHeight", "average");
                        _this2._speech("".concat(_this2._i18n.v("lineHeightAverage")));
                        activeLink(elements.lineHeightAverage);
                    }));
                    click(elements.lineHeightBig, (function() {
                        _this2._setAttrDataBviBody("lineHeight", "big");
                        setCookie("lineHeight", "big");
                        _this2._speech("".concat(_this2._i18n.v("lineHeightBig")));
                        activeLink(elements.lineHeightBig);
                    }));
                    click(elements.letterSpacingNormal, (function() {
                        _this2._setAttrDataBviBody("letterSpacing", "normal");
                        setCookie("letterSpacing", "normal");
                        _this2._speech("".concat(_this2._i18n.v("LetterSpacingNormal")));
                        activeLink(elements.letterSpacingNormal);
                    }));
                    click(elements.letterSpacingAverage, (function() {
                        _this2._setAttrDataBviBody("letterSpacing", "average");
                        setCookie("letterSpacing", "average");
                        _this2._speech("".concat(_this2._i18n.v("LetterSpacingAverage")));
                        activeLink(elements.letterSpacingAverage);
                    }));
                    click(elements.letterSpacingBig, (function() {
                        _this2._setAttrDataBviBody("letterSpacing", "big");
                        setCookie("letterSpacing", "big");
                        _this2._speech("".concat(_this2._i18n.v("LetterSpacingBig")));
                        activeLink(elements.letterSpacingBig);
                    }));
                    click(elements.fontFamilyArial, (function() {
                        _this2._setAttrDataBviBody("fontFamily", "arial");
                        setCookie("fontFamily", "arial");
                        _this2._speech("".concat(_this2._i18n.v("fontArial")));
                        activeLink(elements.fontFamilyArial);
                    }));
                    click(elements.fontFamilyTimes, (function() {
                        _this2._setAttrDataBviBody("fontFamily", "times");
                        setCookie("fontFamily", "times");
                        _this2._speech("".concat(_this2._i18n.v("fontTimes")));
                        activeLink(elements.fontFamilyTimes);
                    }));
                    click(elements.builtElementsOn, (function() {
                        _this2._setAttrDataBviBody("builtElements", "true");
                        setCookie("builtElements", "true");
                        _this2._speech("".concat(_this2._i18n.v("builtElementsOn")));
                        activeLink(elements.builtElementsOn);
                    }));
                    click(elements.builtElementsOff, (function() {
                        _this2._setAttrDataBviBody("builtElements", "false");
                        setCookie("builtElements", "false");
                        _this2._speech("".concat(_this2._i18n.v("builtElementsOFF")));
                        activeLink(elements.builtElementsOff);
                    }));
                    click(elements.reset, (function() {
                        _this2._speech("".concat(_this2._i18n.v("resetSettings")));
                        getObject(_this2._config, (function(key) {
                            _this2._setAttrDataBviBody(key, _this2._config[key]);
                            setCookie(key, _this2._config[key]);
                            activeAll();
                        }));
                    }));
                    getArray(elements.links, (function(element) {
                        click(element, (function(event) {
                            var target = event.target.getAttribute("data-bvi");
                            if (target === "close") {
                                _this2._setAttrDataBviBody("panelActive", "false");
                                setCookie("panelActive", "false");
                                _this2._init();
                            }
                            if (target === "modal") {
                                document.body.style.overflow = "hidden";
                                document.body.classList.add("bvi-noscroll");
                                elements.modal.classList.toggle("show");
                            }
                            if (target === "modal-close") {
                                document.body.classList.remove("bvi-noscroll");
                                document.body.style.overflow = "";
                                elements.modal.classList.remove("show");
                            }
                            if (target === "panel-hide") {
                                document.querySelector(".bvi-panel").classList.add("bvi-panel-hide");
                                document.querySelector(".bvi-link-fixed-top").classList.remove("bvi-hide");
                                document.querySelector(".bvi-link-fixed-top").classList.add("bvi-show");
                                setCookie("panelHide", "true");
                                _this2._speech("".concat(_this2._i18n.v("panelHide")));
                            }
                            if (target === "panel-show") {
                                document.querySelector(".bvi-link-fixed-top").classList.remove("bvi-show");
                                document.querySelector(".bvi-link-fixed-top").classList.add("bvi-hide");
                                document.querySelector(".bvi-panel").classList.remove("bvi-panel-hide");
                                setCookie("panelHide", "false");
                                _this2._speech("".concat(_this2._i18n.v("panelShow")));
                            }
                        }));
                    }));
                    click(elements.modal, (function(event) {
                        if (event.target.contains(elements.modal)) {
                            document.body.classList.remove("bvi-noscroll");
                            document.body.style.overflow = "";
                            elements.modal.classList.remove("show");
                        }
                    }));
                }
            }, {
                key: "_getPanel",
                value: function _getPanel() {
                    var scroll = function scroll() {
                        var scroll = window.pageYOffset !== void 0 ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
                        if (stringToBoolean(getCookie("panelFixed"))) if (scroll > 200) document.querySelector(".bvi-panel").classList.add("bvi-fixed-top"); else document.querySelector(".bvi-panel").classList.remove("bvi-fixed-top");
                    };
                    var panelHide = stringToBoolean(getCookie("panelHide")) ? " bvi-panel-hide" : "";
                    var linkHide = !stringToBoolean(getCookie("panelHide")) ? " bvi-hide" : "bvi-show";
                    var html = "\n    <div class='bvi-panel".concat(panelHide, '\'>\n        <div class="bvi-blocks bvi-block-center">\n            <div class="bvi-block">\n                <div class="bvi-block-title">').concat(this._i18n.t("fontSize"), '</div>\n                <a class="bvi-link bvi-fontSize-minus">А-</a>\n                <a class="bvi-link bvi-fontSize-plus">А+</a>\n            </div>\n            <div class="bvi-block">\n                <div class="bvi-block-title">').concat(this._i18n.t("siteColors"), '</div>\n                <a href="#" class="bvi-link bvi-theme-white">Ц</a>\n                <a href="#" class="bvi-link bvi-theme-black">Ц</a>\n                <a href="#" class="bvi-link bvi-theme-blue">Ц</a>\n                <a href="#" class="bvi-link bvi-theme-brown">Ц</a>\n                <a href="#" class="bvi-link bvi-theme-green">Ц</a>\n            </div>\n            <div class="bvi-block">\n                <div class="bvi-block-title">').concat(this._i18n.t("images"), '</div>\n                <a href="#" class="bvi-link bvi-images-on">\n                    <i class="bvi-images bvi-images-image"></i>\n                </a>\n                <a href="#" class="bvi-link bvi-images-off">\n                    <i class="bvi-images bvi-images-minus-circle"></i>\n                </a>\n                <a href="#" class="bvi-link bvi-images-grayscale">\n                    <i class="bvi-images bvi-images-adjust"></i>\n                </a>\n            </div>\n            <div class="bvi-block">\n                <div class="bvi-block-title">').concat(this._i18n.t("speech"), '</div>\n                <a href="#" class="bvi-link bvi-speech-off">\n                    <i class="bvi-images bvi-images-volume-off"></i>\n                </a>\n                <a href="#" class="bvi-link bvi-speech-on">\n                    <i class="bvi-images bvi-images-volume-up"></i>\n                </a>\n            </div>\n            <div class="bvi-block">\n                <div class="bvi-block-title">').concat(this._i18n.t("settings"), '</div>\n                <a href="#" class="bvi-link" data-bvi="modal">\n                    <i class="bvi-images bvi-images-cog"></i>\n                </a>\n                <a href="#" class="bvi-link" data-bvi="close">\n                    ').concat(this._i18n.t("regularVersionOfTheSite"), '\n                </a>\n                <a href="#" class="bvi-link" data-bvi="panel-hide">\n                    <i class="bvi-images bvi-images-minus"></i>\n                </a>\n            </div>\n        </div>\n        <div class="bvi-modal">\n            <div class="bvi-modal-dialog">\n                <div class="bvi-modal-content">\n                    <div class="bvi-modal-header">\n                        <div class="bvi-modal-title">').concat(this._i18n.t("settings"), '</div>\n                        <a href="#" class="bvi-link bvi-modal-close" data-bvi="modal-close">×</a>\n                    </div>\n                    <div class="bvi-modal-body">\n                        <div class="bvi-blocks bvi-block-center">\n                            <div class="bvi-block">\n                                <div class="bvi-block-title">').concat(this._i18n.t("letterSpacing"), '</div>\n                                <a href="#" class="bvi-link bvi-letter-spacing-normal">').concat(this._i18n.t("normal"), '</a>\n                                <a href="#" class="bvi-link bvi-letter-spacing-average">').concat(this._i18n.t("average"), '</a>\n                                <a href="#" class="bvi-link bvi-letter-spacing-big">').concat(this._i18n.t("big"), '</a>\n                            </div>\n                            <div class="bvi-block">\n                                <div class="bvi-block-title">').concat(this._i18n.t("lineHeight"), '</div>\n                                <a href="#" class="bvi-link bvi-line-height-normal">').concat(this._i18n.t("normal"), '</a>\n                                <a href="#" class="bvi-link bvi-line-height-average">').concat(this._i18n.t("average"), '</a>\n                                <a href="#" class="bvi-link bvi-line-height-big">').concat(this._i18n.t("big"), '</a>\n                            </div>\n                            <div class="bvi-block">\n                                <div class="bvi-block-title">').concat(this._i18n.t("font"), '</div>\n                                <a href="#" class="bvi-link bvi-font-family-arial">').concat(this._i18n.t("arial"), '</a>\n                                <a href="#" class="bvi-link bvi-font-family-times">').concat(this._i18n.t("times"), '</a>\n                            </div>\n                            <div class="bvi-block">\n                                <div class="bvi-block-title">').concat(this._i18n.t("builtElements"), '</div>\n                                <a href="#" class="bvi-link bvi-built-elements-on">').concat(this._i18n.t("on"), '</a>\n                                <a href="#" class="bvi-link bvi-built-elements-off">').concat(this._i18n.t("off"), '</a>\n                            </div>\n                        </div>\n                        <div class="bvi-blocks bvi-block-center">\n                            <a href="https://bvi.isvek.ru" class="bvi-copyright" target="_blank">bvi.isvek.ru</a>\n                        </div>\n                    </div>\n                    <div class="bvi-modal-footer">\n                        <a href="#" class="bvi-link bvi-reset">').concat(this._i18n.t("reset"), "</a>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>");
                    var link = '<a href="#" class="bvi-link bvi-link-fixed-top bvi-no-styles '.concat(linkHide, '" data-bvi="panel-show">') + '<i class="bvi-images bvi-images-eye bvi-images-size-32 bvi-no-styles"></i></a>';
                    window.addEventListener("scroll", scroll);
                    document.querySelector(".bvi-body").insertAdjacentHTML("beforebegin", html);
                    document.querySelector(".bvi-body").insertAdjacentHTML("afterbegin", link);
                    scroll();
                }
            }, {
                key: "_set",
                value: function _set() {
                    var _this3 = this;
                    document.body.classList.add("bvi-active");
                    wrapInner(document.body, "div", "bvi-body");
                    getObject(this._config, (function(key) {
                        return _this3._setAttrDataBviBody(key, getCookie(key));
                    }));
                    getArray(this._elements, (function(element) {
                        return element.style.display = "none";
                    }));
                    document.querySelectorAll("img").forEach((function(element) {
                        if (element.classList.contains("bvi-img")) element.classList.remove("bvi-img");
                    }));
                    document.querySelectorAll("body *").forEach((function(element) {
                        if (element.classList.contains("bvi-background-image")) element.classList.remove("bvi-background-image");
                    }));
                }
            }, {
                key: "_remove",
                value: function _remove() {
                    var bviPanel = document.querySelector(".bvi-panel");
                    var bviBody = document.querySelector(".bvi-body");
                    var bviLinkFixedTop = document.querySelector(".bvi-link-fixed-top");
                    if (bviPanel) bviPanel.remove();
                    if (bviBody) unwrap(bviBody);
                    if (bviLinkFixedTop) bviLinkFixedTop.remove();
                    this._speech("".concat(this._i18n.v("panelOff")));
                    document.body.classList.remove("bvi-active");
                    getArray(this._elements, (function(element) {
                        return element.style.display = "";
                    }));
                    if (stringToBoolean(getCookie("reload"))) document.location.reload();
                    getObject(this._config, (function(key) {
                        removeCookie(key);
                    }));
                    this._speechPlayer();
                    removeCookie("panelActive");
                }
            }, {
                key: "_images",
                value: function _images() {
                    document.querySelectorAll("img").forEach((function(element) {
                        if (!element.classList.contains("bvi-no-style")) element.classList.add("bvi-img");
                    }));
                    document.querySelectorAll(".bvi-body *").forEach((function(element) {
                        var style = getComputedStyle(element);
                        if (style.backgroundImage !== "none" && style.background !== "none" && !element.classList.contains("bvi-no-style")) element.classList.add("bvi-background-image");
                    }));
                }
            }, {
                key: "_getConfig",
                value: function _getConfig(config) {
                    config = _objectSpread2(_objectSpread2({}, Default), config);
                    var extended = {};
                    for (var keyDefault in Default) extended[keyDefault] = config[keyDefault];
                    checkConfig(extended, DefaultType, DefaultOptions);
                    return extended;
                }
            }, {
                key: "_setAttrDataBviBody",
                value: function _setAttrDataBviBody() {
                    var name = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
                    var value = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
                    document.querySelector(".bvi-body").setAttribute("data-bvi-".concat(name), value);
                }
            }, {
                key: "_speechPlayer",
                value: function _speechPlayer() {
                    var _this4 = this;
                    var selectorSpeechText = document.querySelectorAll(".bvi-speech-text");
                    var selectorSpeechLink = document.querySelectorAll(".bvi-speech-link");
                    var selectorBviSpeech = document.querySelectorAll(".bvi-speech");
                    if ("speechSynthesis" in window && stringToBoolean(getCookie("speech"))) {
                        if (selectorBviSpeech) {
                            if (selectorSpeechText) selectorSpeechText.forEach((function(element) {
                                return unwrap(element);
                            }));
                            if (selectorSpeechLink) selectorSpeechLink.forEach((function(element) {
                                return element.remove();
                            }));
                            selectorBviSpeech.forEach((function(speechDivBlock, index) {
                                var id = "bvi-speech-text-id-".concat(index + 1);
                                var html = '\n            <div class="bvi-speech-link">\n              <a href="#" class="bvi-link bvi-speech-play" title="Воспроизвести">Воспроизвести</a>\n              <a href="#" class="bvi-link bvi-speech-pause disabled" title="Пауза">Пауза</a>\n              <a href="#" class="bvi-link bvi-speech-resume disabled" title="Продолжить">Продолжить</a>\n              <a href="#" class="bvi-link bvi-speech-stop disabled" title="Стоп">Стоп</i></a>\n          </div>';
                                wrapInner(speechDivBlock, "div", "bvi-speech-text ".concat(id));
                                speechDivBlock.insertAdjacentHTML("afterbegin", html);
                            }));
                            var selectorPlay = document.querySelectorAll(".bvi-speech-play");
                            var selectorPause = document.querySelectorAll(".bvi-speech-pause");
                            var selectorResume = document.querySelectorAll(".bvi-speech-resume");
                            var selectorStop = document.querySelectorAll(".bvi-speech-stop");
                            var el = function el(elements, callback) {
                                elements.forEach((function(element) {
                                    element.addEventListener("click", (function(event) {
                                        event.preventDefault();
                                        if (typeof callback === "function") return callback(element, event);
                                    }), false);
                                }));
                            };
                            el(selectorPlay, (function(element, event) {
                                var target = event.target;
                                var text = target.parentNode.nextElementSibling;
                                var closest = event.target.closest(".bvi-speech-link");
                                var play = document.querySelectorAll(".bvi-speech-play");
                                var pause = document.querySelectorAll(".bvi-speech-pause");
                                var resume = document.querySelectorAll(".bvi-speech-resume");
                                var stop = document.querySelectorAll(".bvi-speech-stop");
                                _this4._speech(text.textContent, text, true);
                                play.forEach((function(element) {
                                    return element.classList.remove("disabled");
                                }));
                                pause.forEach((function(element) {
                                    return element.classList.add("disabled");
                                }));
                                resume.forEach((function(element) {
                                    return element.classList.add("disabled");
                                }));
                                stop.forEach((function(element) {
                                    return element.classList.add("disabled");
                                }));
                                target.classList.add("disabled");
                                closest.querySelector(".bvi-speech-pause").classList.remove("disabled");
                                closest.querySelector(".bvi-speech-stop").classList.remove("disabled");
                            }));
                            el(selectorPause, (function(element, event) {
                                var target = event.target;
                                var closest = event.target.closest(".bvi-speech-link");
                                target.classList.add("disabled");
                                closest.querySelector(".bvi-speech-resume").classList.remove("disabled");
                                synth().pause();
                            }));
                            el(selectorResume, (function(element, event) {
                                var target = event.target;
                                var closest = event.target.closest(".bvi-speech-link");
                                target.classList.add("disabled");
                                closest.querySelector(".bvi-speech-pause").classList.remove("disabled");
                                synth().resume();
                            }));
                            el(selectorStop, (function(element, event) {
                                var target = event.target;
                                var closest = event.target.closest(".bvi-speech-link");
                                target.classList.add("disabled");
                                closest.querySelector(".bvi-speech-pause").classList.add("disabled");
                                closest.querySelector(".bvi-speech-play").classList.remove("disabled");
                                synth().cancel();
                            }));
                        }
                    } else {
                        if (selectorSpeechText) selectorSpeechText.forEach((function(element) {
                            return unwrap(element);
                        }));
                        if (selectorSpeechLink) selectorSpeechLink.forEach((function(element) {
                            return element.remove();
                        }));
                    }
                }
            }, {
                key: "_speech",
                value: function _speech(text, element) {
                    var _this5 = this;
                    var echo = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
                    if ("speechSynthesis" in window && stringToBoolean(getCookie("speech"))) {
                        synth().cancel();
                        var getWordAt = function getWordAt(str, pos) {
                            str = String(str);
                            pos = Number(pos) >>> 0;
                            var left = str.slice(0, pos + 1).search(/\S+$/);
                            var right = str.slice(pos).search(/\s/);
                            if (right < 0) return str.slice(left);
                            return str.slice(left, right + pos);
                        };
                        var chunkLength = 120;
                        var patternRegex = new RegExp("^[\\s\\S]{" + Math.floor(chunkLength / 2) + "," + chunkLength + "}[.!?,]{1}|^[\\s\\S]{1," + chunkLength + "}$|^[\\s\\S]{1," + chunkLength + "} ");
                        var array = [];
                        var $text = text;
                        var voices = synth().getVoices();
                        while ($text.length > 0) {
                            array.push($text.match(patternRegex)[0]);
                            $text = $text.substring(array[array.length - 1].length);
                        }
                        array.forEach((function(getText) {
                            var utter = new SpeechSynthesisUtterance(getText.trim());
                            utter.volume = 1;
                            utter.rate = 1;
                            utter.pitch = 1;
                            utter.lang = _this5._config.lang;
                            for (var i = 0; i < voices.length; i++) {
                                if (_this5._config.lang === "ru-RU" && voices[i].name === "Microsoft Pavel - Russian (Russia)") utter.voice = voices[i];
                                if (_this5._config.lang === "en-US" && voices[i].name === "Microsoft Pavel - English (English)") utter.voice = voices[i];
                            }
                            if (echo) {
                                utter.onboundary = function(event) {
                                    element.classList.add("bvi-highlighting");
                                    var world = getWordAt(event.utterance.text, event.charIndex);
                                    var textContent = element.textContent;
                                    var term = world.replace(/(\s+)/, "((<[^>]+>)*$1(<[^>]+>)*)");
                                    var pattern = new RegExp("(" + term + ")", "gi");
                                    textContent = textContent.replace(pattern, "<mark>$1</mark>");
                                    textContent = textContent.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</mark>$2<mark>$4");
                                    element.innerHTML = textContent;
                                };
                                utter.onend = function(event) {
                                    element.classList.remove("bvi-highlighting");
                                    var textContent = element.textContent;
                                    textContent = textContent.replace(/(<mark>$1<\/mark>)/, "$1");
                                    element.innerHTML = textContent;
                                };
                            }
                            synth().speak(utter);
                        }));
                    }
                }
            } ]);
            return Bvi;
        }();
        var index_umd = {
            Bvi
        };
        return index_umd;
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        var Bvi = new isvek.Bvi({
            target: ".bvi-open",
            theme: "blue",
            font: "arial",
            fontSize: 24,
            letterSpacing: "normal",
            lineHeight: "normal",
            images: true,
            reload: false,
            speech: true,
            builtElements: true,
            panelHide: false,
            panelFixed: true,
            lang: "ru-RU"
        });
        console.log(Bvi);
    }));
    document.querySelectorAll("[data-dropdown-hover]").forEach((function(dropDownWrapper) {
        const dropDownBtn = dropDownWrapper.querySelector("[data-dropdown-button]");
        const dropDownList = dropDownWrapper.querySelector("[data-dropdown-list]");
        const dropDownListItems = dropDownList.querySelectorAll("[data-dropdown-item]");
        const dropDownInput = dropDownWrapper.querySelector("[data-dropdown-input]");
        dropDownBtn.addEventListener("mouseenter", (function(e) {
            dropDownList.classList.add("visible");
            this.classList.add("active");
        }));
        dropDownListItems.forEach((function(listItem) {
            listItem.addEventListener("click", (function(e) {
                e.stopPropagation();
                dropDownBtn.innerText = this.innerText;
                dropDownBtn.focus();
                dropDownInput.value = this.dataset.value;
                dropDownList.classList.remove("visible");
                dropDownBtn.classList.remove("active");
            }));
        }));
        document.addEventListener("keydown", (function(e) {
            if (e.key === "Tab" || e.key === "Escape") {
                dropDownBtn.classList.remove("active");
                dropDownList.classList.remove("visible");
            }
        }));
    }));
    const dropdownElements = document.querySelectorAll("[data-dropdown-hover]");
    dropdownElements.forEach((dropdown => {
        dropdown.addEventListener("mouseout", (event => {
            const dropDownList = dropdown.querySelector("[data-dropdown-list]");
            const dropDownBtn = dropdown.querySelector("[data-dropdown-button]");
            if (!dropdown.contains(event.relatedTarget)) if (dropDownList.classList.contains("visible")) {
                dropDownList.classList.remove("visible");
                dropDownBtn.classList.remove("active");
            }
        }));
    }));
    window.addEventListener("load", (function() {
        document.body.classList.remove("load");
    }));
    const searchInput = document.querySelector("#search-input");
    document.querySelector("#suggestions-list");
    const clearInputBtn = document.querySelector(".search-header__button-clear");
    function clearInput() {
        searchInput.value = "";
        clearInputBtn.classList.remove("visible");
    }
    searchInput.addEventListener("input", (() => {
        const inputValue = searchInput.value.trim().toLowerCase();
        clearInputBtn.classList.add("visible");
        if (!inputValue) return;
    }));
    clearInputBtn.addEventListener("click", clearInput);
    window["FLS"] = false;
    spollers();
})();