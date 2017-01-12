"use strict";define("manager-client/app",["exports","ember","manager-client/resolver","ember-load-initializers","manager-client/config/environment"],function(e,t,n,a,l){var r=void 0;t.default.MODEL_FACTORY_INJECTIONS=!0,r=t.default.Application.extend({modulePrefix:l.default.modulePrefix,podModulePrefix:l.default.podModulePrefix,Resolver:n.default}),(0,a.default)(r,l.default.modulePrefix),e.default=r}),define("manager-client/components/progress-bar",["exports","ember"],function(e,t){e.default=t.default.Component.extend({classNameBindings:[":progress",":progress-striped","active"],active:function(){return 100!==parseInt(this.get("percent"),10)}.property("percent"),barStyle:function(){var e=parseInt(this.get("percent"),10);return e>0?(e>100&&(e=100),("width: "+this.get("percent")+"%").htmlSafe()):"".htmlSafe()}.property("percent")})}),define("manager-client/components/repo-status",["exports","ember"],function(e,t){e.default=t.default.Component.extend({tagName:"tr",upgradeDisabled:function(){var e=this.get("upgradingRepo");if(!e){var t=this.get("managerRepo");return!!t&&(!t.get("upToDate")&&t!==this.get("repo"))}return!0}.property("upgradingRepo","repo","managerRepo","managerRepo.upToDate"),actions:{upgrade:function(){this.sendAction("upgrade",this.get("repo"))}}})}),define("manager-client/components/x-console",["exports","ember"],function(e,t){e.default=t.default.Component.extend({classNameBindings:[":logs"],_outputChanged:function(){t.default.run.scheduleOnce("afterRender",this,"_scrollBottom")}.observes("output"),_scrollBottom:function(){this.get("followOutput")&&this.$().scrollTop(this.$()[0].scrollHeight)},_scrollOnInsert:function(){this._scrollBottom()}.on("didInsertElement")})}),define("manager-client/controllers/application",["exports","ember"],function(e,t){e.default=t.default.Controller.extend({showBanner:function(){if(this.get("bannerDismissed"))return!1;var e=this.get("banner");return e&&e.length>0}.property("banner","bannerDismissed","banner.@each"),appendBannerHtml:function(e){var t=this.get("banner")||[];t.indexOf(e)===-1&&t.pushObject(e),this.set("banner",t)},logoUrl:function(){return Discourse.getURL("/assets/images/docker-manager-aff8eaea0445c0488c19f8cfd14faa8c2b278924438f19048eacc175d7d134e4.png")}.property(),returnToSiteUrl:function(){return Discourse.getURL("/")}.property(),backupsUrl:function(){return Discourse.getURL("/admin/backups")}.property(),actions:{dismiss:function(){this.set("bannerDismissed",!0)}}})}),define("manager-client/controllers/index",["exports","ember"],function(e,t){e.default=t.default.Controller.extend({managerRepo:null,upgrading:null})}),define("manager-client/controllers/processes",["exports","ember"],function(e,t){e.default=t.default.Controller.extend({autoRefresh:!1,init:function(){this._super();var e=this;window.setInterval(function(){e.performRefresh()},5e3)},performRefresh:function(){this.get("autoRefresh")&&this.get("model").refresh()}})}),define("manager-client/controllers/upgrade",["exports","ember"],function(e,t){e.default=t.default.Controller.extend({output:null,init:function(){this._super(),this.reset()},complete:t.default.computed.equal("status","complete"),failed:t.default.computed.equal("status","failed"),messageReceived:function(e){switch(e.type){case"log":this.set("output",this.get("output")+e.value+"\n");break;case"percent":this.set("percent",e.value);break;case"status":this.set("status",e.value),"complete"!==e.value&&"failed"!==e.value||this.set("model.upgrading",!1),"complete"===e.value&&this.set("model.version",this.get("model.latest.version"))}},upgradeButtonText:function(){return this.get("model.upgrading")?"Upgrading...":"Start Upgrading"}.property("model.upgrading"),startBus:function(){var e=this;MessageBus.subscribe("/docker/upgrade",function(t){e.messageReceived(t)})},stopBus:function(){MessageBus.unsubscribe("/docker/upgrade")},reset:function(){this.setProperties({output:"",status:null,percent:0})},actions:{start:function(){this.reset();var e=this.get("model");e.get("upgrading")||e.startUpgrade()},resetUpgrade:function(){var e=this;bootbox.confirm("WARNING: You should only reset upgrades that have failed and are not running.\n\nThis will NOT cancel currently running builds and should only be used as a last resort.",function(t){if(t){var n=e.get("model");n.resetUpgrade().then(function(){e.reset()})}})}}})}),define("manager-client/helpers/app-version",["exports","ember","manager-client/config/environment"],function(e,t,n){function a(){return l}e.appVersion=a;var l=n.default.APP.version;e.default=t.default.Helper.helper(a)}),define("manager-client/helpers/fmt-commit",["exports","ember"],function(e,t){var n=function(){function e(e,t){var n=[],a=!0,l=!1,r=void 0;try{for(var o,s=e[Symbol.iterator]();!(a=(o=s.next()).done)&&(n.push(o.value),!t||n.length!==t);a=!0);}catch(e){l=!0,r=e}finally{try{!a&&s.return&&s.return()}finally{if(l)throw r}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();e.default=t.default.Helper.helper(function(e){var a=n(e,3),l=a[0],r=a[1],o=a[2];if(!t.default.isNone(r)){if(t.default.isNone(o))return new t.default.String.htmlSafe("(<a href='"+r+"'>"+l+"</a>)");var s=r.substr(0,r.search(/(\.git)?$/)),i=o.indexOf("/")!==-1?o.split("/")[1]:o;return new t.default.String.htmlSafe("(<a href='"+s+"/compare/"+l+"..."+i+"'>"+l+"</a>)")}})}),define("manager-client/helpers/is-after",["exports","ember","manager-client/config/environment","ember-moment/helpers/is-after"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/is-before",["exports","ember","manager-client/config/environment","ember-moment/helpers/is-before"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/is-between",["exports","ember","manager-client/config/environment","ember-moment/helpers/is-between"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/is-same-or-after",["exports","ember","manager-client/config/environment","ember-moment/helpers/is-same-or-after"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/is-same-or-before",["exports","ember","manager-client/config/environment","ember-moment/helpers/is-same-or-before"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/is-same",["exports","ember","manager-client/config/environment","ember-moment/helpers/is-same"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-add",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-add"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-calendar",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-calendar"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-duration",["exports","ember-moment/helpers/moment-duration"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/moment-format",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-format"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-from-now",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-from-now"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-from",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-from"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-subtract",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-subtract"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-to-date",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-to-date"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-to-now",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-to-now"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-to",["exports","ember","manager-client/config/environment","ember-moment/helpers/moment-to"],function(e,t,n,a){e.default=a.default.extend({globalAllowEmpty:!!t.default.get(n.default,"moment.allowEmpty")})}),define("manager-client/helpers/moment-unix",["exports","ember-moment/helpers/unix"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"unix",{enumerable:!0,get:function(){return t.unix}})}),define("manager-client/helpers/moment",["exports","ember-moment/helpers/moment"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/now",["exports","ember-moment/helpers/now"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/unix",["exports","ember-moment/helpers/unix"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"unix",{enumerable:!0,get:function(){return t.unix}})}),define("manager-client/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","manager-client/config/environment"],function(e,t,n){var a=n.default.APP,l=a.name,r=a.version;e.default={name:"App Version",initialize:(0,t.default)(l,r)}}),define("manager-client/initializers/container-debug-adapter",["exports","ember-resolver/container-debug-adapter"],function(e,t){e.default={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0];e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}}),define("manager-client/initializers/crsf-token",["exports","ember-ajax/request"],function(e,t){e.default={name:"findCsrfToken",initialize:function(){return(0,t.default)("/session/csrf").then(function(e){var t=e.csrf;$.ajaxPrefilter(function(e,n,a){e.crossDomain||a.setRequestHeader("X-CSRF-Token",t)})})}}}),define("manager-client/initializers/export-application-global",["exports","ember","manager-client/config/environment"],function(e,t,n){function a(){var e=arguments[1]||arguments[0];if(n.default.exportApplicationGlobal!==!1){var a;if("undefined"!=typeof window)a=window;else if("undefined"!=typeof global)a=global;else{if("undefined"==typeof self)return;a=self}var l,r=n.default.exportApplicationGlobal;l="string"==typeof r?r:t.default.String.classify(n.default.modulePrefix),a[l]||(a[l]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete a[l]}}))}}e.initialize=a,e.default={name:"export-application-global",initialize:a}}),define("manager-client/initializers/message-bus",["exports"],function(e){e.default={name:"message-bus",initialize:function(){MessageBus.baseUrl=Discourse.longPollingBaseUrl,"/"!==MessageBus.baseUrl?MessageBus.ajax=function(e){return e.headers=e.headers||{},e.headers["X-Shared-Session-Key"]=$("meta[name=shared_session_key]").attr("content"),$.ajax(e)}:MessageBus.baseUrl=Discourse.getURL("/")}}}),define("manager-client/models/process-list",["exports","ember-ajax/request","ember"],function(e,t,n){function a(){return l.create().refresh()}e.find=a;var l=n.default.Object.extend({output:null,refresh:function(){var e=this;return(0,t.default)(Discourse.getURL("/admin/docker/ps"),{dataType:"text"}).then(function(t){return e.set("output",t),e})}});e.default=l}),define("manager-client/models/repo",["exports","ember-ajax/request","ember"],function(e,t,n){var a=[],l=n.default.Object.extend({upToDate:function(){return!this.get("upgrading")&this.get("version")===this.get("latest.version")}.property("upgrading","version","latest.version"),shouldCheck:function(){if(n.default.isNone(this.get("version")))return!1;if(this.get("checking"))return!1;var e=this.get("lastCheckedAt");if(e){var t=(new Date).getTime()-e;return t>6e4}return!0}.property().volatile(),repoAjax:function(e,n){return n=n||{},n.data=this.getProperties("path","version","branch"),(0,t.default)(Discourse.getURL(e),n)},findLatest:function(){var e=this;return new n.default.RSVP.Promise(function(t){return e.get("shouldCheck")?(e.set("checking",!0),void e.repoAjax(Discourse.getURL("/admin/docker/latest")).then(function(a){e.setProperties({checking:!1,lastCheckedAt:(new Date).getTime(),latest:n.default.Object.create(a.latest)}),t()})):t()})},findProgress:function(){return this.repoAjax(Discourse.getURL("/admin/docker/progress")).then(function(e){return e.progress})},resetUpgrade:function(){var e=this;return this.repoAjax(Discourse.getURL("/admin/docker/upgrade"),{dataType:"text",type:"DELETE"}).then(function(){e.set("upgrading",!1)})},startUpgrade:function(){var e=this;return this.set("upgrading",!0),this.repoAjax(Discourse.getURL("/admin/docker/upgrade"),{dataType:"text",type:"POST"}).catch(function(t){e.set("upgrading",!1)})}});l.reopenClass({findAll:function(){return new n.default.RSVP.Promise(function(e){return a.length?e(a):void(0,t.default)(Discourse.getURL("/admin/docker/repos")).then(function(t){a=t.repos.map(function(e){return l.create(e)}),e(a)})})},findUpgrading:function(){return this.findAll().then(function(e){return e.findBy("upgrading",!0)})},find:function(e){return this.findAll().then(function(t){return t.findBy("id",e)})}}),e.default=l}),define("manager-client/resolver",["exports","ember-resolver"],function(e,t){e.default=t.default}),define("manager-client/router",["exports","ember","manager-client/config/environment"],function(e,t,n){var a=t.default.Router.extend({location:n.default.locationType,rootURL:n.default.rootURL});a.map(function(){this.route("processes"),this.route("upgrade",{path:"/upgrade/:id"})}),e.default=a}),define("manager-client/routes/index",["exports","manager-client/models/repo","ember"],function(e,t,n){e.default=n.default.Route.extend({model:function(){return t.default.findAll()},setupController:function(e,t){var n=this,a=n.controllerFor("application");e.setProperties({model:t,upgrading:null}),window.Discourse&&window.Discourse.hasLatestPngcrush||a.appendBannerHtml("<b>WARNING:</b> You are running an old Docker image, <a href='https://meta.discourse.org/t/how-do-i-update-my-docker-image-to-latest/23325'>please upgrade</a>."),t.forEach(function(t){t.findLatest(),t.get("upgrading")&&e.set("upgrading",t),"docker_manager"===t.get("id")&&e.set("managerRepo",t),"discourse"===t.get("id")&&"origin/master"===t.get("branch")&&a.appendBannerHtml("<b>WARNING:</b> Your Discourse is tracking the 'master' branch which may be unstable, <a href='https://meta.discourse.org/t/change-tracking-branch-for-your-discourse-instance/17014'>we recommend tracking the 'tests-passed' branch</a>.")})},actions:{upgrade:function(e){this.transitionTo("upgrade",e)}}})}),define("manager-client/routes/processes",["exports","manager-client/models/process-list","ember"],function(e,t,n){e.default=n.default.Route.extend({model:t.find})}),define("manager-client/routes/upgrade",["exports","manager-client/models/repo","ember"],function(e,t,n){e.default=n.default.Route.extend({model:function(e){return t.default.find(e.id)},afterModel:function(e){var a=this;return t.default.findUpgrading().then(function(t){return t&&t!==e?n.default.RSVP.Promise.reject("wat"):e.findLatest().then(function(){return e.findProgress().then(function(e){a.set("progress",e)})})})},setupController:function(e,t){e.reset(),e.setProperties({model:t,output:this.get("progress.logs"),percent:this.get("progress.percentage")}),e.startBus()},deactivate:function(){this.controllerFor("upgrade").stopBus()}})}),define("manager-client/services/ajax",["exports","ember-ajax/services/ajax"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/services/moment",["exports","ember","manager-client/config/environment","ember-moment/services/moment"],function(e,t,n,a){e.default=a.default.extend({defaultFormat:t.default.get(n.default,"moment.outputFormat")})}),define("manager-client/templates/application",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"ctJRz2Va",block:'{"statements":[["open-element","header",[]],["static-attr","class","container"],["flush-element"],["text","\\n  "],["block",["link-to"],["index"],null,7],["text","\\n  "],["open-element","h1",[]],["flush-element"],["block",["link-to"],["index"],null,6],["close-element"],["text","\\n"],["close-element"],["text","\\n\\n"],["open-element","div",[]],["static-attr","class","container"],["flush-element"],["text","\\n\\n"],["block",["if"],[["get",["showBanner"]]],null,5],["text","\\n  "],["open-element","ul",[]],["static-attr","class","nav nav-tabs"],["flush-element"],["text","\\n"],["block",["link-to"],["index"],[["tagName"],["li"]],3],["block",["link-to"],["processes"],[["tagName"],["li"]],1],["text","\\n    "],["open-element","li",[]],["flush-element"],["open-element","a",[]],["dynamic-attr","href",["unknown",["returnToSiteUrl"]],null],["flush-element"],["text","Return to site"],["close-element"],["close-element"],["text","\\n    "],["open-element","li",[]],["flush-element"],["open-element","a",[]],["dynamic-attr","href",["unknown",["backupsUrl"]],null],["flush-element"],["text","Backups"],["close-element"],["close-element"],["text","\\n  "],["close-element"],["text","\\n\\n  "],["append",["unknown",["outlet"]],false],["text","\\n"],["close-element"],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","Processes"]],"locals":[]},{"statements":[["text","      "],["block",["link-to"],["processes"],null,0],["text","\\n"]],"locals":[]},{"statements":[["text","Versions"]],"locals":[]},{"statements":[["text","      "],["block",["link-to"],["index"],null,2],["text","\\n"]],"locals":[]},{"statements":[["text","          "],["open-element","p",[]],["flush-element"],["append",["get",["row"]],true],["close-element"],["text","\\n"]],"locals":["row"]},{"statements":[["text","    "],["open-element","div",[]],["static-attr","id","banner"],["flush-element"],["text","\\n      "],["open-element","div",[]],["static-attr","id","banner-content"],["flush-element"],["text","\\n        "],["open-element","div",[]],["static-attr","class","close"],["modifier",["action"],[["get",[null]],"dismiss"]],["flush-element"],["open-element","i",[]],["static-attr","class","fa fa-times"],["static-attr","title","Dismiss this banner."],["flush-element"],["close-element"],["close-element"],["text","\\n"],["block",["each"],[["get",["banner"]]],null,4],["text","      "],["close-element"],["text","\\n    "],["close-element"],["text","\\n"]],"locals":[]},{"statements":[["text","Upgrade"]],"locals":[]},{"statements":[["open-element","img",[]],["dynamic-attr","src",["unknown",["logoUrl"]],null],["static-attr","class","logo"],["flush-element"],["close-element"]],"locals":[]}],"hasPartials":false}',meta:{moduleName:"manager-client/templates/application.hbs"}})}),define("manager-client/templates/components/progress-bar",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"faGgRn0d",block:'{"statements":[["open-element","div",[]],["static-attr","class","progress-bar"],["dynamic-attr","style",["unknown",["barStyle"]],null],["flush-element"],["close-element"],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',meta:{moduleName:"manager-client/templates/components/progress-bar.hbs"}})}),define("manager-client/templates/components/repo-status",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"7r0DVbs9",block:'{"statements":[["open-element","td",[]],["flush-element"],["text","\\n  "],["append",["unknown",["repo","name"]],false],["text","\\n  "],["append",["helper",["fmt-commit"],[["get",["repo","version"]],["get",["repo","url"]],["get",["repo","branch"]]],null],false],["text","\\n"],["close-element"],["text","\\n"],["open-element","td",[]],["flush-element"],["text","\\n"],["block",["if"],[["get",["repo","checking"]]],null,7,6],["close-element"],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","        "],["open-element","button",[]],["static-attr","class","btn"],["dynamic-attr","disabled",["unknown",["upgradeDisabled"]],null],["modifier",["action"],[["get",[null]],"upgrade"]],["flush-element"],["text","Upgrade to the Latest Version"],["close-element"],["text","\\n"]],"locals":[]},{"statements":[["text","        "],["open-element","button",[]],["static-attr","class","btn"],["modifier",["action"],[["get",[null]],"upgrade"]],["flush-element"],["text","Currently Upgrading..."],["close-element"],["text","\\n"]],"locals":[]},{"statements":[["text","            —\\n"]],"locals":[]},{"statements":[["text","            "],["append",["helper",["moment-from-now"],[["get",["repo","latest","date"]]],[["interval"],[1000]]],false],["text","\\n"]],"locals":[]},{"statements":[["text","    "],["open-element","div",[]],["static-attr","class","new-version"],["flush-element"],["text","\\n      "],["open-element","h4",[]],["flush-element"],["text","New Version Available!"],["close-element"],["text","\\n      "],["open-element","ul",[]],["flush-element"],["text","\\n        "],["open-element","li",[]],["flush-element"],["text","Remote Version: "],["append",["helper",["fmt-commit"],[["get",["repo","latest","version"]],["get",["repo","url"]],["get",["repo","branch"]]],null],false],["close-element"],["text","\\n        "],["open-element","li",[]],["flush-element"],["text","Last Updated:\\n"],["block",["if"],[["get",["repo","latest","date"]]],null,3,2],["text","        "],["close-element"],["text","\\n        "],["open-element","li",[]],["static-attr","class","new-commits"],["flush-element"],["append",["unknown",["repo","latest","commits_behind"]],false],["text"," new commits"],["close-element"],["text","\\n      "],["close-element"],["text","\\n"],["block",["if"],[["get",["repo","upgrading"]]],null,1,0],["text","    "],["close-element"],["text","\\n  "]],"locals":[]},{"statements":[["text","    Up to date\\n"]],"locals":[]},{"statements":[["block",["if"],[["get",["repo","upToDate"]]],null,5,4]],"locals":[]},{"statements":[["text","    Checking for new version...\\n"]],"locals":[]}],"hasPartials":false}',meta:{moduleName:"manager-client/templates/components/repo-status.hbs"}})}),define("manager-client/templates/components/x-console",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"pAvT7OSR",block:'{"statements":[["append",["unknown",["output"]],false],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',meta:{moduleName:"manager-client/templates/components/x-console.hbs"}})}),define("manager-client/templates/index",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"BqyyoGBa",block:'{"statements":[["open-element","table",[]],["static-attr","class","table"],["static-attr","id","repos"],["flush-element"],["text","\\n  "],["open-element","tr",[]],["flush-element"],["text","\\n    "],["open-element","th",[]],["static-attr","style","width: 50%"],["flush-element"],["text","Repository Name"],["close-element"],["text","\\n    "],["open-element","th",[]],["flush-element"],["text","Status"],["close-element"],["text","\\n  "],["close-element"],["text","\\n  "],["open-element","tbody",[]],["flush-element"],["text","\\n"],["block",["each"],[["get",["model"]]],null,0],["text","  "],["close-element"],["text","\\n"],["close-element"],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      "],["append",["helper",["repo-status"],null,[["repo","upgradingRepo","managerRepo","upgrade"],[["get",["repo"]],["get",["upgrading"]],["get",["managerRepo"]],"upgrade"]]],false],["text","\\n"]],"locals":["repo"]}],"hasPartials":false}',meta:{moduleName:"manager-client/templates/index.hbs"}})}),define("manager-client/templates/loading",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"KVS2Qgkh",block:'{"statements":[["open-element","h3",[]],["static-attr","class","loading"],["flush-element"],["text","Loading..."],["close-element"],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',meta:{moduleName:"manager-client/templates/loading.hbs"}})}),define("manager-client/templates/processes",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"oTRdyLm0",block:'{"statements":[["append",["helper",["x-console"],null,[["output"],[["get",["model","output"]]]]],false],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',meta:{moduleName:"manager-client/templates/processes.hbs"}})}),define("manager-client/templates/upgrade",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"uiOJmK+r",block:'{"statements":[["open-element","h3",[]],["flush-element"],["text","Upgrade "],["append",["unknown",["model","name"]],false],["close-element"],["text","\\n\\n"],["append",["helper",["progress-bar"],null,[["percent"],[["get",["percent"]]]]],false],["text","\\n\\n"],["block",["if"],[["get",["complete"]]],null,4],["text","\\n"],["block",["if"],[["get",["failed"]]],null,3],["text","\\n"],["block",["if"],[["get",["model","upToDate"]]],null,2,1],["text","\\n"],["append",["helper",["x-console"],null,[["output","followOutput"],[["get",["output"]],true]]],false],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      "],["open-element","button",[]],["static-attr","class","btn unlock"],["modifier",["action"],[["get",[null]],"resetUpgrade"]],["flush-element"],["text","Reset Upgrade"],["close-element"],["text","\\n"]],"locals":[]},{"statements":[["text","  "],["open-element","div",[]],["static-attr","style","clear: both"],["flush-element"],["text","\\n    "],["open-element","button",[]],["dynamic-attr","disabled",["unknown",["model","upgrading"]],null],["static-attr","class","btn"],["modifier",["action"],[["get",[null]],"start"]],["flush-element"],["append",["unknown",["upgradeButtonText"]],false],["close-element"],["text","\\n"],["block",["if"],[["get",["model","upgrading"]]],null,0],["text","  "],["close-element"],["text","\\n"]],"locals":[]},{"statements":[["text","  "],["open-element","p",[]],["flush-element"],["append",["unknown",["model","name"]],false],["text"," is at the newest version "],["append",["helper",["fmt-commit"],[["get",["model","version"]],["get",["model","url"]],["get",["model","branch"]]],null],false],["text","."],["close-element"],["text","\\n"]],"locals":[]},{"statements":[["text","  "],["open-element","p",[]],["flush-element"],["text","Sorry, there was an error upgrading Discourse. Please check the logs below."],["close-element"],["text","\\n"]],"locals":[]},{"statements":[["text","  "],["open-element","p",[]],["flush-element"],["text","Upgrade completed successfully!"],["close-element"],["text","\\n  "],["open-element","p",[]],["flush-element"],["text","Note: The web server restarts in the background. It\'s a good idea to wait 30 seconds or so\\n     before refreshing your browser to see the latest version of the application."],["close-element"],["text","\\n"]],"locals":[]}],"hasPartials":false}',meta:{moduleName:"manager-client/templates/upgrade.hbs"}})}),define("manager-client/config/environment",["ember"],function(e){var t="manager-client";try{var n=t+"/config/environment",a=document.querySelector('meta[name="'+n+'"]').getAttribute("content"),l=JSON.parse(unescape(a)),r={default:l};return Object.defineProperty(r,"__esModule",{value:!0}),r}catch(e){throw new Error('Could not read config from meta tag with name "'+n+'".')}}),runningTests||require("manager-client/app").default.create({name:"manager-client",version:"0.0.0+5cfcb104"});