"use strict"
define("manager-client/app",["exports","manager-client/resolver","ember-load-initializers","manager-client/config/environment"],function(e,t,n,r){var a
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,Ember.MODEL_FACTORY_INJECTIONS=!0,a=Ember.Application.extend({modulePrefix:r.default.modulePrefix,podModulePrefix:r.default.podModulePrefix,Resolver:t.default}),(0,n.default)(a,r.default.modulePrefix)
var o=a
e.default=o}),define("manager-client/components/progress-bar",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Component.extend({classNameBindings:[":progress",":progress-striped","active"],active:Ember.computed("percent",function(){return 100!==parseInt(this.get("percent"),10)}),barStyle:Ember.computed("percent",function(){var e=parseInt(this.get("percent"),10)
return e>0?(e>100&&(e=100),("width: "+this.get("percent")+"%").htmlSafe()):"".htmlSafe()})})
e.default=t}),define("manager-client/components/repo-status",["exports","manager-client/discourse"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Component.extend({router:Ember.inject.service(),tagName:"tr",upgradeDisabled:Ember.computed("upgradingRepo","repo","managerRepo","managerRepo.upToDate",function(){if(!this.get("upgradingRepo")){var e=this.get("managerRepo")
return!!e&&(!e.get("upToDate")&&e!==this.get("repo"))}return!0}),officialRepoImageSrc:Ember.computed("repo.official",function(){if(this.get("repo.official"))return t.default.getURL("/plugins/docker_manager/images/font-awesome-check-circle.png")}),actions:{upgrade:function(){this.get("router").transitionTo("upgrade",this.get("repo"))}}})
e.default=n}),define("manager-client/components/x-console",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Component.extend({classNameBindings:[":logs"],_outputChanged:Ember.observer("output",function(){Ember.run.scheduleOnce("afterRender",this,"_scrollBottom")}),_scrollBottom:function(){this.get("followOutput")&&this.$().scrollTop(this.$()[0].scrollHeight)},didInsertElement:function(){this._super.apply(this,arguments),this._scrollBottom()}})
e.default=t}),define("manager-client/controllers/application",["exports","manager-client/discourse"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Controller.extend({showBanner:Ember.computed("banner","bannerDismissed","banner.[]",function(){if(this.get("bannerDismissed"))return!1
var e=this.get("banner")
return e&&e.length>0}),appendBannerHtml:function(e){var t=this.get("banner")||[];-1===t.indexOf(e)&&t.pushObject(e),this.set("banner",t)},logoUrl:Ember.computed(function(){return t.default.getURL("/assets/images/docker-manager-aff8eaea0445c0488c19f8cfd14faa8c2b278924438f19048eacc175d7d134e4.png")}),returnToSiteUrl:Ember.computed(function(){return t.default.getURL("/")}),backupsUrl:Ember.computed(function(){return t.default.getURL("/admin/backups")}),actions:{dismiss:function(){this.set("bannerDismissed",!0)}}})
e.default=n}),define("manager-client/controllers/index",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Controller.extend({managerRepo:null,upgrading:null,upgradeAllButtonDisabled:Ember.computed("managerRepo.upToDate","allUpToDate",function(){return!this.get("managerRepo.upToDate")||this.get("allUpToDate")}),allUpToDate:Ember.computed("model.@each.upToDate",function(){return this.get("model").every(function(e){return e.get("upToDate")})}),actions:{upgradeAllButton:function(){this.replaceRoute("upgrade","all")}}})
e.default=t}),define("manager-client/controllers/processes",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.Controller.extend({autoRefresh:!1,init:function(){var e=this
this._super(),window.setInterval(function(){e.performRefresh()},5e3)},performRefresh:function(){this.get("autoRefresh")&&this.get("model").refresh()}})
e.default=t}),define("manager-client/controllers/upgrade",["exports","manager-client/models/repo"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Controller.extend({output:null,init:function(){this._super(),this.reset()},complete:Ember.computed.equal("status","complete"),failed:Ember.computed.equal("status","failed"),multiUpgrade:Ember.computed("model.length",function(){return 1!==this.get("model.length")}),title:Ember.computed("model.@each.name",function(){return this.get("multiUpgrade")?"All":this.get("model")[0].get("name")}),isUpToDate:Ember.computed("model.@each.upToDate",function(){return this.get("model").every(function(e){return e.get("upToDate")})}),upgrading:Ember.computed("model.@each.upgrading",function(){return this.get("model").some(function(e){return e.get("upgrading")})}),repos:function(){var e=this.get("model")
return this.get("isMultiple")?e:[e]},updateAttribute:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2]
this.get("model").forEach(function(r){t=n?r.get(t):t,r.set(e,t)})},messageReceived:function(e){switch(e.type){case"log":this.set("output",this.get("output")+e.value+"\n")
break
case"percent":this.set("percent",e.value)
break
case"status":this.set("status",e.value),"complete"===e.value&&this.get("model").filter(function(e){return e.get("upgrading")}).forEach(function(e){e.set("version",e.get("latest.version"))}),"complete"!==e.value&&"failed"!==e.value||this.updateAttribute("upgrading",!1)}},upgradeButtonText:Ember.computed("upgrading",function(){return this.get("upgrading")?"Upgrading...":"Start Upgrading"}),startBus:function(){var e=this
MessageBus.subscribe("/docker/upgrade",function(t){e.messageReceived(t)})},stopBus:function(){MessageBus.unsubscribe("/docker/upgrade")},reset:function(){this.setProperties({output:"",status:null,percent:0})},actions:{start:function(){if(this.reset(),this.get("multiUpgrade"))return this.get("model").filter(function(e){return!e.get("upToDate")}).forEach(function(e){return e.set("upgrading",!0)}),t.default.upgradeAll()
var e=this.get("model")[0]
e.get("upgrading")||e.startUpgrade()},resetUpgrade:function(){var e=this
bootbox.confirm("WARNING: You should only reset upgrades that have failed and are not running.\n\nThis will NOT cancel currently running builds and should only be used as a last resort.",function(n){if(n){if(e.get("multiUpgrade"))return t.default.resetAll(e.get("model").filter(function(e){return!e.get("upToDate")})).finally(function(){e.reset(),e.updateAttribute("upgrading",!1)})
e.get("model")[0].resetUpgrade().then(function(){e.reset()})}})}}})
e.default=n}),define("manager-client/discourse",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t={getURL:function(e){var n
return this.hasOwnProperty("rootUrl")||(n=Em.$("#preloaded-data").data("preload"),Em.$.extend(t,n)),e&&("/"===e||/^\/[^/]/.test(e))?-1!==e.indexOf(this.rootUrl)?e:("/"!==e[0]&&(e="/"+e),this.rootUrl+e):e}},n=t
e.default=n}),define("manager-client/helpers/app-version",["exports","manager-client/config/environment","ember-cli-app-version/utils/regexp"],function(e,t,n){function r(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=t.default.APP.version,o=r.versionOnly||r.hideSha,i=r.shaOnly||r.hideVersion,l=null
return o&&(r.showExtended&&(l=a.match(n.versionExtendedRegExp)),l||(l=a.match(n.versionRegExp))),i&&(l=a.match(n.shaRegExp)),l?l[0]:a}Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=r,e.default=void 0
var a=Ember.Helper.helper(r)
e.default=a}),define("manager-client/helpers/is-after",["exports","ember-moment/helpers/is-after"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/is-before",["exports","ember-moment/helpers/is-before"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/is-between",["exports","ember-moment/helpers/is-between"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/is-same-or-after",["exports","ember-moment/helpers/is-same-or-after"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/is-same-or-before",["exports","ember-moment/helpers/is-same-or-before"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/is-same",["exports","ember-moment/helpers/is-same"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/loc",["exports","@ember/string/helpers/loc"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"loc",{enumerable:!0,get:function(){return t.loc}})}),define("manager-client/helpers/moment-add",["exports","ember-moment/helpers/moment-add"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/moment-calendar",["exports","ember-moment/helpers/moment-calendar"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/moment-diff",["exports","ember-moment/helpers/moment-diff"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/moment-duration",["exports","ember-moment/helpers/moment-duration"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/moment-format",["exports","ember-moment/helpers/moment-format"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/moment-from-now",["exports","ember-moment/helpers/moment-from-now"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/moment-from",["exports","ember-moment/helpers/moment-from"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/moment-subtract",["exports","ember-moment/helpers/moment-subtract"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/moment-to-date",["exports","ember-moment/helpers/moment-to-date"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/moment-to-now",["exports","ember-moment/helpers/moment-to-now"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/moment-to",["exports","ember-moment/helpers/moment-to"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/moment-unix",["exports","ember-moment/helpers/unix"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/moment",["exports","ember-moment/helpers/moment"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})})
define("manager-client/helpers/new-commits",["exports"],function(e){function t(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(!(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)))return
var n=[],r=!0,a=!1,o=void 0
try{for(var i,l=e[Symbol.iterator]();!(r=(i=l.next()).done)&&(n.push(i.value),!t||n.length!==t);r=!0);}catch(s){a=!0,o=s}finally{try{r||null==l.return||l.return()}finally{if(a)throw o}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Helper.helper(function(e){var n=t(e,4),r=n[0],a=n[1],o=n[2],i=n[3]
if(0===parseInt(r))return""
var l="".concat(r," new commit").concat(1===r?"":"s")
if(Ember.isNone(i))return l
var s=i.substr(0,i.search(/(\.git)?$/))
return l="<a href='".concat(s,"/compare/").concat(a,"...").concat(o,"'>").concat(l,"</a>"),new Ember.String.htmlSafe(l)})
e.default=n}),define("manager-client/helpers/now",["exports","ember-moment/helpers/now"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/pluralize",["exports","ember-inflector/lib/helpers/pluralize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.default
e.default=n}),define("manager-client/helpers/singularize",["exports","ember-inflector/lib/helpers/singularize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.default
e.default=n}),define("manager-client/helpers/unix",["exports","ember-moment/helpers/unix"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/helpers/utc",["exports","ember-moment/helpers/utc"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"utc",{enumerable:!0,get:function(){return t.utc}})}),define("manager-client/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","manager-client/config/environment"],function(e,t,n){var r,a
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,n.default.APP&&(r=n.default.APP.name,a=n.default.APP.version)
var o={name:"App Version",initialize:(0,t.default)(r,a)}
e.default=o}),define("manager-client/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0]
e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}
e.default=n}),define("manager-client/initializers/crsf-token",["exports","manager-client/discourse"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n={name:"findCsrfToken",initialize:function(){return Em.$.ajax(t.default.getURL("/session/csrf")).then(function(e){var t=e.csrf
Em.$.ajaxPrefilter(function(e,n,r){e.crossDomain||r.setRequestHeader("X-CSRF-Token",t)})})}}
e.default=n}),define("manager-client/initializers/ember-data",["exports","ember-data/setup-container","ember-data"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r={name:"ember-data",initialize:t.default}
e.default=r}),define("manager-client/initializers/export-application-global",["exports","manager-client/config/environment"],function(e,t){function n(){var e=arguments[1]||arguments[0]
if(!1!==t.default.exportApplicationGlobal){var n
if("undefined"!=typeof window)n=window
else if("undefined"!=typeof global)n=global
else{if("undefined"==typeof self)return
n=self}var r,a=t.default.exportApplicationGlobal
r="string"==typeof a?a:Ember.String.classify(t.default.modulePrefix),n[r]||(n[r]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete n[r]}}))}}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=n,e.default=void 0
var r={name:"export-application-global",initialize:n}
e.default=r}),define("manager-client/initializers/message-bus",["exports","manager-client/discourse"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n={name:"message-bus",initialize:function(){MessageBus.baseUrl=t.default.longPollingBaseUrl.replace(/\/$/,"")+"/","/"!==MessageBus.baseUrl?MessageBus.ajax=function(e){return e.headers=e.headers||{},e.headers["X-Shared-Session-Key"]=Em.$("meta[name=shared_session_key]").attr("content"),Em.$.ajax(e)}:MessageBus.baseUrl=t.default.getURL("/")}}
e.default=n}),define("manager-client/instance-initializers/ember-data",["exports","ember-data/initialize-store-service"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n={name:"ember-data",initialize:t.default}
e.default=n}),define("manager-client/models/process-list",["exports","manager-client/discourse"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.find=function(){return n.create().refresh()},e.default=void 0
var n=Ember.Object.extend({output:null,refresh:function(){var e=this
return Em.$.ajax(t.default.getURL("/admin/docker/ps"),{dataType:"text"}).then(function(t){return e.set("output",t),e})}})
var r=n
e.default=r}),define("manager-client/models/repo",["exports","manager-client/discourse"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=[]
function r(e){return e.map(function(e){return e.get("version")}).join(", ")}var a=Ember.Object.extend({unloaded:!0,checking:!1,checkingStatus:Ember.computed.or("unloaded","checking"),upToDate:Ember.computed("upgrading","version","latest.version",function(){return!this.get("upgrading")&this.get("version")===this.get("latest.version")}),prettyVersion:Ember.computed("version","pretty_version",function(){return this.get("pretty_version")||this.get("version")}),prettyLatestVersion:Ember.computed("latest.{version,pretty_version}",function(){return this.get("latest.pretty_version")||this.get("latest.version")}),shouldCheck:Ember.computed(function(){if(Ember.isNone(this.get("version")))return!1
if(this.get("checking"))return!1
var e=this.get("lastCheckedAt")
return!e||(new Date).getTime()-e>6e4}).volatile(),repoAjax:function(e,n){return(n=n||{}).data=this.getProperties("path","version","branch"),Em.$.ajax(t.default.getURL(e),n)},findLatest:function(){var e=this
return new Ember.RSVP.Promise(function(n){if(!e.get("shouldCheck"))return e.set("unloaded",!1),n()
e.set("checking",!0),e.repoAjax(t.default.getURL("/admin/docker/latest")).then(function(t){e.setProperties({unloaded:!1,checking:!1,lastCheckedAt:(new Date).getTime(),latest:Ember.Object.create(t.latest)}),n()})})},findProgress:function(){return this.repoAjax(t.default.getURL("/admin/docker/progress")).then(function(e){return e.progress})},resetUpgrade:function(){var e=this
return this.repoAjax(t.default.getURL("/admin/docker/upgrade"),{dataType:"text",type:"DELETE"}).then(function(){e.set("upgrading",!1)})},startUpgrade:function(){var e=this
return this.set("upgrading",!0),this.repoAjax(t.default.getURL("/admin/docker/upgrade"),{dataType:"text",type:"POST"}).catch(function(){e.set("upgrading",!1)})}})
a.reopenClass({findAll:function(){return new Ember.RSVP.Promise(function(e){if(n.length)return e(n)
Em.$.ajax(t.default.getURL("/admin/docker/repos")).then(function(t){n=t.repos.map(function(e){return a.create(e)}),e(n)})})},findUpgrading:function(){return this.findAll().then(function(e){return e.findBy("upgrading",!0)})},find:function(e){return this.findAll().then(function(t){return t.findBy("id",e)})},upgradeAll:function(){return Em.$.ajax(t.default.getURL("/admin/docker/upgrade"),{dataType:"text",type:"POST",data:{path:"all"}})},resetAll:function(e){return Em.$.ajax(t.default.getURL("/admin/docker/upgrade"),{dataType:"text",type:"DELETE",data:{path:"all",version:r(e)}})},findLatestAll:function(){return Em.$.ajax(t.default.getURL("/admin/docker/latest"),{dataType:"text",type:"GET",data:{path:"all"}})},findAllProgress:function(e){return Em.$.ajax(t.default.getURL("/admin/docker/progress"),{dataType:"text",type:"GET",data:{path:"all",version:r(e)}})}})
var o=a
e.default=o}),define("manager-client/resolver",["exports","ember-resolver"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.default
e.default=n}),define("manager-client/router",["exports","manager-client/config/environment"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Router.extend({location:t.default.locationType,rootURL:t.default.rootURL})
n.map(function(){this.route("processes"),this.route("upgrade",{path:"/upgrade/:id"})})
var r=n
e.default=r}),define("manager-client/routes/index",["exports","manager-client/models/repo"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Route.extend({model:function(){return t.default.findAll()},loadRepos:function(e){var t=this
0!==e.length&&this.loadRepo(e.shift()).then(function(){return t.loadRepos(e)})},loadRepo:function(e){return e.findLatest()},setupController:function(e,t){var n=this.controllerFor("application")
e.setProperties({model:t,upgrading:null}),t.forEach(function(t){t.get("upgrading")&&e.set("upgrading",t),"docker_manager"===t.get("id")&&e.set("managerRepo",t),"discourse"===t.get("id")&&"origin/master"===t.get("branch")&&n.appendBannerHtml("<b>WARNING:</b> Your Discourse is tracking the 'master' branch which may be unstable, <a href='https://meta.discourse.org/t/change-tracking-branch-for-your-discourse-instance/17014'>we recommend tracking the 'tests-passed' branch</a>.")}),this.loadRepos(t.slice(0))}})
e.default=n}),define("manager-client/routes/processes",["exports","manager-client/models/process-list"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Route.extend({model:t.find})
e.default=n}),define("manager-client/routes/upgrade",["exports","manager-client/models/repo"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=Ember.Route.extend({model:function(e){return"all"===e.id?t.default.findAll():t.default.find(e.id)},afterModel:function(e){var n=this
return Array.isArray(e)?t.default.findLatestAll().then(function(r){return JSON.parse(r).repos.forEach(function(t){var n=e.find(function(e){return e.get("path")===t.path})
n&&(delete t.path,n.set("latest",Ember.Object.create(t)))}),t.default.findAllProgress(e.filter(function(e){return!e.get("upToDate")})).then(function(e){n.set("progress",JSON.parse(e).progress)})}):t.default.findUpgrading().then(function(t){return t&&t!==e?Ember.RSVP.Promise.reject("wat"):e.findLatest().then(function(){return e.findProgress().then(function(e){n.set("progress",e)})})})},setupController:function(e,t){e.reset(),e.setProperties({model:Array.isArray(t)?t:[t],output:this.get("progress.logs"),percent:this.get("progress.percentage")}),e.startBus()},deactivate:function(){this.controllerFor("upgrade").stopBus()}})
e.default=n}),define("manager-client/services/ajax",["exports","ember-ajax/services/ajax"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("manager-client/services/moment",["exports","ember-moment/services/moment","manager-client/config/environment"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=Ember.get,a=t.default.extend({defaultFormat:r(n.default,"moment.outputFormat")})
e.default=a}),define("manager-client/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"3gLHNdYy",block:'{"symbols":["row"],"statements":[[7,"div"],[11,"class","container"],[9],[0,"\\n  "],[7,"div"],[11,"class","back-site"],[9],[0,"\\n    "],[7,"a"],[12,"href",[21,"returnToSiteUrl"]],[9],[0,"Return to site"],[10],[0,"\\n  "],[10],[0,"\\n\\n  "],[7,"header"],[11,"class","container"],[9],[0,"\\n    "],[4,"link-to",["index"],null,{"statements":[[7,"img"],[12,"src",[21,"logoUrl"]],[11,"class","logo"],[9],[10]],"parameters":[]},null],[0,"\\n    "],[7,"h1"],[9],[4,"link-to",["index"],null,{"statements":[[0,"Upgrade"]],"parameters":[]},null],[10],[0,"\\n  "],[10],[0,"\\n\\n  "],[7,"div"],[11,"class","container"],[9],[0,"\\n\\n"],[4,"if",[[23,["showBanner"]]],null,{"statements":[[0,"      "],[7,"div"],[11,"id","banner"],[9],[0,"\\n        "],[7,"div"],[11,"id","banner-content"],[9],[0,"\\n          "],[7,"div"],[11,"class","close"],[9],[7,"i"],[11,"class","fa fa-times"],[11,"title","Dismiss this banner."],[9],[10],[3,"action",[[22,0,[]],"dismiss"]],[10],[0,"\\n"],[4,"each",[[23,["banner"]]],null,{"statements":[[0,"            "],[7,"p"],[9],[1,[22,1,[]],true],[10],[0,"\\n"]],"parameters":[1]},null],[0,"        "],[10],[0,"\\n      "],[10],[0,"\\n"]],"parameters":[]},null],[0,"\\n    "],[7,"ul"],[11,"class","nav nav-tabs"],[9],[0,"\\n"],[4,"link-to",["index"],[["tagName","class"],["li","nav-item"]],{"statements":[[0,"        "],[4,"link-to",["index"],[["class"],["nav-link"]],{"statements":[[0,"Versions"]],"parameters":[]},null],[0,"\\n"]],"parameters":[]},null],[4,"link-to",["processes"],[["tagName","class"],["li","nav-item"]],{"statements":[[0,"        "],[4,"link-to",["processes"],[["class"],["nav-link"]],{"statements":[[0,"Processes"]],"parameters":[]},null],[0,"\\n"]],"parameters":[]},null],[0,"\\n      "],[7,"li"],[11,"class","nav-item"],[9],[7,"a"],[11,"class","nav-link"],[12,"href",[21,"backupsUrl"]],[9],[0,"Backups"],[10],[10],[0,"\\n    "],[10],[0,"\\n\\n    "],[1,[21,"outlet"],false],[0,"\\n  "],[10],[0,"\\n"],[10],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"manager-client/templates/application.hbs"}})
e.default=t}),define("manager-client/templates/components/progress-bar",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"PcfP/X+G",block:'{"symbols":[],"statements":[[7,"div"],[11,"class","progress-bar progress-bar-striped progress-bar-animated"],[12,"style",[21,"barStyle"]],[9],[10],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"manager-client/templates/components/progress-bar.hbs"}})
e.default=t}),define("manager-client/templates/components/repo-status",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"FX4UHLlA",block:'{"symbols":[],"statements":[[7,"td"],[9],[0,"\\n"],[4,"if",[[23,["repo","official"]]],null,{"statements":[[0,"    "],[7,"img"],[11,"class","check-circle"],[12,"src",[21,"officialRepoImageSrc"]],[11,"alt","Official Plugin"],[11,"title","Official Plugin"],[9],[10],[0,"\\n"]],"parameters":[]},null],[10],[0,"\\n"],[7,"td"],[9],[0,"\\n  "],[7,"a"],[12,"href",[28,[[23,["repo","url"]]]]],[9],[1,[23,["repo","name"]],false],[10],[0,"\\n  "],[7,"span"],[11,"class","current commit-hash"],[9],[1,[23,["repo","prettyVersion"]],false],[10],[0,"\\n"],[10],[0,"\\n"],[7,"td"],[9],[0,"\\n"],[4,"if",[[23,["repo","checkingStatus"]]],null,{"statements":[[0,"    Checking for new version...\\n"]],"parameters":[]},{"statements":[[4,"if",[[23,["repo","upToDate"]]],null,{"statements":[[0,"    Up to date\\n"]],"parameters":[]},{"statements":[[0,"    "],[7,"div"],[11,"class","new-version"],[9],[0,"\\n      "],[7,"h4"],[9],[0,"New Version Available!"],[10],[0,"\\n      "],[7,"ul"],[9],[0,"\\n        "],[7,"li"],[9],[0,"Remote Version: "],[7,"span"],[11,"class","new commit-hash"],[9],[1,[23,["repo","prettyLatestVersion"]],false],[10],[10],[0,"\\n        "],[7,"li"],[9],[0,"Last Updated:\\n"],[4,"if",[[23,["repo","latest","date"]]],null,{"statements":[[0,"            "],[1,[27,"moment-from-now",[[23,["repo","latest","date"]]],[["interval"],[1000]]],false],[0,"\\n"]],"parameters":[]},{"statements":[[0,"            —\\n"]],"parameters":[]}],[0,"        "],[10],[0,"\\n        "],[7,"li"],[11,"class","new-commits"],[9],[1,[27,"new-commits",[[23,["repo","latest","commits_behind"]],[23,["repo","version"]],[23,["repo","latest","version"]],[23,["repo","url"]]],null],false],[10],[0,"\\n      "],[10],[0,"\\n"],[4,"if",[[23,["repo","upgrading"]]],null,{"statements":[[0,"        "],[7,"button"],[11,"class","btn"],[9],[0,"Currently Upgrading..."],[3,"action",[[22,0,[]],"upgrade"]],[10],[0,"\\n"]],"parameters":[]},{"statements":[[0,"        "],[7,"button"],[11,"class","upgrade-button btn"],[12,"disabled",[21,"upgradeDisabled"]],[9],[0,"Upgrade"],[3,"action",[[22,0,[]],"upgrade"]],[10],[0,"\\n"]],"parameters":[]}],[0,"    "],[10],[0,"\\n  "]],"parameters":[]}]],"parameters":[]}],[10],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"manager-client/templates/components/repo-status.hbs"}})
e.default=t}),define("manager-client/templates/components/x-console",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"5AIb1c7Y",block:'{"symbols":[],"statements":[[1,[21,"output"],false],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"manager-client/templates/components/x-console.hbs"}})
e.default=t}),define("manager-client/templates/index",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"XojZQQlT",block:'{"symbols":["repo"],"statements":[[7,"button"],[12,"disabled",[21,"upgradeAllButtonDisabled"]],[11,"id","upgrade-all"],[11,"class","btn"],[9],[0,"\\n"],[4,"if",[[23,["allUpToDate"]]],null,{"statements":[[0,"    All Up-to-date\\n"]],"parameters":[]},{"statements":[[0,"    Upgrade All\\n"]],"parameters":[]}],[3,"action",[[22,0,[]],"upgradeAllButton"]],[10],[0,"\\n\\n"],[7,"table"],[11,"class","table"],[11,"id","repos"],[9],[0,"\\n  "],[7,"tr"],[9],[0,"\\n    "],[7,"th"],[9],[10],[0,"\\n    "],[7,"th"],[11,"style","width: 50%"],[9],[0,"Repository"],[10],[0,"\\n    "],[7,"th"],[9],[0,"Status"],[10],[0,"\\n  "],[10],[0,"\\n  "],[7,"tbody"],[9],[0,"\\n"],[4,"each",[[23,["model"]]],null,{"statements":[[0,"      "],[1,[27,"repo-status",null,[["repo","upgradingRepo","managerRepo"],[[22,1,[]],[23,["upgrading"]],[23,["managerRepo"]]]]],false],[0,"\\n"]],"parameters":[1]},null],[0,"  "],[10],[0,"\\n"],[10],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"manager-client/templates/index.hbs"}})
e.default=t}),define("manager-client/templates/loading",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"RuK/j8VC",block:'{"symbols":[],"statements":[[7,"h3"],[11,"class","loading"],[9],[0,"Loading..."],[10],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"manager-client/templates/loading.hbs"}})
e.default=t}),define("manager-client/templates/processes",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"n/TsMj7R",block:'{"symbols":[],"statements":[[1,[27,"x-console",null,[["output"],[[23,["model","output"]]]]],false],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"manager-client/templates/processes.hbs"}})
e.default=t}),define("manager-client/templates/upgrade",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"H4zT5h6q",block:'{"symbols":[],"statements":[[7,"h3"],[9],[0,"Upgrade "],[1,[21,"title"],false],[10],[0,"\\n\\n"],[1,[27,"progress-bar",null,[["percent"],[[23,["percent"]]]]],false],[0,"\\n\\n"],[4,"if",[[23,["complete"]]],null,{"statements":[[0,"  "],[7,"p"],[9],[0,"Upgrade completed successfully!"],[10],[0,"\\n"]],"parameters":[]},null],[0,"\\n"],[4,"if",[[23,["failed"]]],null,{"statements":[[0,"  "],[7,"p"],[9],[0,"Sorry, there was an error upgrading Discourse. Please check the logs below."],[10],[0,"\\n"]],"parameters":[]},null],[0,"\\n"],[4,"if",[[23,["isUpToDate"]]],null,{"statements":[[4,"unless",[[23,["multiUpgrade"]]],null,{"statements":[[0,"    "],[7,"p"],[9],[1,[21,"title"],false],[0," is at the newest version."],[10],[0,"\\n"]],"parameters":[]},{"statements":[[0,"    "],[7,"p"],[9],[0,"Everything is up-to-date."],[10],[0,"\\n"]],"parameters":[]}]],"parameters":[]},{"statements":[[0,"  "],[7,"div"],[11,"style","clear: both"],[9],[0,"\\n    "],[7,"button"],[12,"disabled",[21,"upgrading"]],[11,"class","btn"],[9],[1,[21,"upgradeButtonText"],false],[3,"action",[[22,0,[]],"start"]],[10],[0,"\\n"],[4,"if",[[23,["upgrading"]]],null,{"statements":[[0,"      "],[7,"button"],[11,"class","btn unlock"],[9],[0,"Reset Upgrade"],[3,"action",[[22,0,[]],"resetUpgrade"]],[10],[0,"\\n"]],"parameters":[]},null],[0,"  "],[10],[0,"\\n"]],"parameters":[]}],[0,"\\n"],[1,[27,"x-console",null,[["output","followOutput"],[[23,["output"]],true]]],false],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"manager-client/templates/upgrade.hbs"}})
e.default=t})
define("manager-client/config/environment",[],function(){try{var e="manager-client/config/environment",t=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),n={default:JSON.parse(decodeURIComponent(t))}
return Object.defineProperty(n,"__esModule",{value:!0}),n}catch(r){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("manager-client/app").default.create({name:"manager-client",version:"0.0.0+58031696"})
