/*
 AUTHOR: Raghav Mittal
 email: raghavmittal101@gmail.com
*/

var annolet = {};
annolet.keys = {
  fileCSS: null,
  index: 0,
  HTMLParentTagName: "body",
  newTagName: null,
  newTagId: null,
  newTagClass: null,
  innerHTMLText: "",
  fileJS: "#",
  JSParentTagName: "head",
  buttonName: null,
  buttonOnClick: null,
  triggerFunctions:[
    {
      trigger: annolet.onClickEvent.getXpath(),
      on: [anno_highlight()]
    },
],
  init: function(manifestObject){
    if(manifestObject.fileCSS) annolet.keys.fileCSS = manifestObject.fileCSS;
    if(manifestObject.index) annolet.keys.index = manifestObject.index;
    if(manifestObject.HTMLParentTagName) annolet.keys.HTMLParentTagName = manifestObject.HTMLParentTagName;
    if(manifestObject.newTagName) annolet.keys.newTagName = manifestObject.newTagName;
    if(manifestObject.newTagId) annolet.keys.newTagId = manifestObject.newTagId;
    if(manifestObject.newTagClass) annolet.keys.newTagClass = manifestObject.newTagClass;
    if(manifestObject.innerHTMLText) annolet.keys.innerHTMLText = manifestObject.innerHTMLText;
    if(manifestObject.fileJS) annolet.keys.fileJS = manifestObject.fileJS;
    if(manifestObject.JSParentTagName) annolet.keys.JSParentTagName = manifestObject.JSParentTagName;
    if(manifestObject.buttonName) annolet.keys.buttonName = manifestObject.buttonName;
    if(manifestObject.buttonOnClick) annolet.keys.buttonOnClick = manifestObject.buttonOnClick;
  },

  loadJSON: function(){
    /*
      This function is for getting json from server and loading it to
      frontend. it will help us in calling webservices to from using
      manifest file JSON file.
    */
    var pathJSON = "https://rawgit.com/SSS-Studio-development/joiner/master/src/jsonj.json";
    $.getJSON(pathJSON, function (json) {
      annolet.keys.json = json;
/*
      for(var i=0; i<json.intial.length; i++){
        annolet.inject.init(json.initial[i]);
        annolet.inject.injectCSS();
        annolet.inject.injectHTML();
        annolet.inject.injectJS();
      }
*/
    });
  }
}
annolet.inject = {
  injectCSS: function(){
    var link = document.createElement('link');
    link.href = annolet.keys.fileCSS + "?v=" + parseInt(Math.random() * 999); //a random mock version number is added everytime file is called to prevent loading of cached css file by browser.
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName('head')[0].appendChild(link);
  },
  injectHTML: function(){
    /*
      HTMLParentTagName: name of parent node (optional)(default: body)
      index: index of parent node under which new element will be created(optional)(default: 0)
      newTagName: name of new child node to be created(optinal)(default: appends HTML to body)
      newTagId: id of newTagName (optional)(default: NULL)
      newTagClass: className of newTagName (optional)(default: NULL)
      innerHTMLText: html to be inserted into DOM. (required)

      if you dont want to add new child, then dont provide newTagId, newTagName, newTagClass
    */
    var parent = document.getElementsByTagName(annolet.keys.HTMLParentTagName)[annolet.keys.index];
    // if newTagName is given, else append innerHTML to body.
    if(annolet.keys.newTagName){
      var tagName = document.createElement(annolet.keys.newTagName);
      if(annolet.keys.newTagId){tagName.id += ' ' + annolet.keys.newTagId;}
      if(annolet.keys.newTagClass){tagName.className += annolet.keys.newTagClass;}
      tagName.innerHTML = annolet.keys.innerHTMLText;
      parent.appendChild(tagName);
      }
    else {parent.innerHTML += "\n" + annolet.keys.innerHTMLText;}
  },
  injectJS: function(){
    /*
      JSParentTagName(optional)(defaut: 'head')- usually JS is injected into '<head>' but if you want to
      inject under someother node then specify.
      jsLocation(required)(default: '#') - location of js file which is to be injected
    */
    var script = document.createElement("script");
    script.type="text/javascript"
    script.src = annolet.keys.fileJS;
    document.getElementsByTagName(annolet.keys.JSParentTagName)[0].appendChild(script);
  },
}

//------------------------------------------------------------------------------
annolet.xpath = {
    xpath: null,
    element: null,

    // function to get Xpath to passed element
    getByElement: function(element) {
        if(element){this.element = element;}
        if (this.element.id !== '') {
            return "//*[@id='" + this.element.id + "']";
        }
        if (element === document.body) {
            return "html/" + this.element.tagName.toLowerCase();
        } //added 'html/' to generate a valid Xpath even if parent has no ID.
        var ix = 0;
        var siblings = this.element.parentNode.childNodes;
        for (var i = 0; i < siblings.length; i++) {
            var sibling = siblings[i];
            if (sibling === element) {
                return this.get(this.element.parentNode) + '/' + this.element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
            }
            if (sibling.nodeType === 1 && sibling.tagName === this.element.tagName) {
                ix++;
            }
        }
    },

    // function to evaluate element from Xpath
    evaluate: function(xpath) {
        if(xpath){this.xpath = xpath;}
        return document.evaluate(this.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    },
}
annolet.onClickEvent = {
  getXpath: function(){
  // function which provides event handler for webservices which want to get mouse clicks
  // it returns the element clicked and root of the document which is in case of HTML DOMs is often '<html>' tag
  /*
  BUG:
  not returning target and root to annolet.target and annolet.root
  */
    document.onclick = function(event) {
      if (event === undefined) {
        event = window.event;
      } // for IE
      var target = 'target' in event ? event.target : event.srcElement; // for IE
      var root = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
      return annolet.xpath.getByElement(target);
    };
  },
};


// it contains all the funcitons which will initially run to create container trigger handler etc. fetch data for webservices
annolet.main = {
/*
  1. When user clicks annoelet bookmarklet, it shows up.
    1 injects annoletJS into DOM
    2 go to manifest file
    2.1 gets location of manifest file and get it into host machine
    3 get all webservices
    3.1 parses it and injects into DOM
    3.1.1 get all the objects into stack
    3.1.2 go through each object and inject html, js, css into DOM one by one.
    3.1.3 create buttons one by one after only after corresponding files are loaded successfully linked with proper functionality
    3.1.4 add buttons to UI
    4 works!
*/
}

/*
var head = document.getElementsByTagName('head')[0];
var scr = document.createElement("script");
scr.src = "https://rawgit.com/SSS-Studio-development/joiner/master/src/annolet.js?v=342";
head.appendChild(scr);
*/

//______________________________________________________________________________
//------------------------------- EXPERIMENTATION ------------------------------
//______________________________________________________________________________


//
// // this function will iterate through each property of service.
// annolet.service: function(serviceObject){
//   for(var property in serviceObject){
//     this.property = serviceObject.property;
//   }
// }
//
// // creating array of services.. this function will iterate through each object
// annolet.createServicesArr: function(){
//     for(var i=0; i<json.services.length(); i++){
//       annolet.serviceArr[i] = new service(json.services[i]);
//   }
// };



//
// annolet.metafile = {
//   fileCSS: null,  // CSS file to be injected
//   HTMLParentTagName: "body",  // tag name under which new HTML tag will be appended
//   HTMLParentTagNameIndex: 0, // index of the tag if there are multiple tags of same name
//   newTagName: null, // name of new tag to be created
//   newTagId: null,
//   newTagClass: null,
//   innerHTMLText: "",
//   fileJS: "#", // javascript file to be injected
//   JSParentTagName: "head", // tag name under which new HTML tag will be appended
//   JSParentTagNameIndex: 0,
//   menuButtonName: null, // name of button which will be created in annolet interface
//   eventOnClick: null, // function to be called when user clicks dom element. to pass xpath through this function. pass "annolet.xpath"
// }

var $j = jQuery.noConflict();

var annolet={};

annolet.getJSON = function(){
      /*
        This function is for getting json from server and loading it to
        frontend. it will help us in calling webservices to from using
        manifest file JSON file.
      */
      var pathJSON = "//rawgit.com/SSS-Studio-development/joiner/master/src/manifest.json"+ "?v=" + parseInt(Math.random() * 999);
      $j.getJSON(pathJSON, function(json) {
          annolet.metafile = json;
      });
  };
annolet.connectWebservices = function() {
    var services = annolet.metafile.services;
    for(var i = 0; i < services.length; i++) {
        services[i].id = i + 1; // reserving 0 for exit.
        if (services[i].fileCSS !== null) {
            annolet.inject.injectCSS(services[i]);
            console.log("injectedCSS");
        }
        if (services[i].innerHTMLText !== null) {
            annolet.inject.injectHTML(services[i]);
            console.log("injectedHTML");
        }
        if (services[i].fileJS !== null) {
            annolet.inject.injectJS(services[i]);
            console.log("injectedJS");
        }
        if (services[i].menuButtonName !== null) {
            annolet.createButtons(services[i]);
            console.log("buttons done");
        }
    }
};
annolet.inject = {
    injectCSS: function(service) {
      var link = document.createElement('link');
      // using rawgit.com MaxCDN.. files directly linked to git repo 'annoletjs/master'
      link.href = service.fileCSS; //random version number removed bcoz some browser take it as text file and not as CSS.
      link.type = "text/css";
      link.rel = "stylesheet";
      document.getElementsByTagName('head')[0].appendChild(link);
    },
    injectHTML: function(service) {
    // HTMLParentTagName: name of parent node (optional)(default: body)
    // index: index of parent node under which new element will be created(optional)(default: 0)
    // newTagName: name of new child node to be created(optinal)(default: appends HTML to body)
    // newTagId: id of newTagName (optional)(default: NULL)
    // newTagClass: className of newTagName (optional)(default: NULL)
    // innerHTMLText: html to be inserted into DOM. (required)
    // if you dont want to add new child, then dont provide newTagId, newTagName, newTagClass

        var parent = document.getElementsByTagName(service.HTMLParentTagName)[service.HTMLParentTagNameIndex]; // if newTagName is given, else append innerHTML to body.
        if (service.newTagName !== null) {
            var tagName = document.createElement(service.newTagName);
            if (service.newTagId !== null) {
                tagName.id += " " + service.newTagId;
            }
            if (service.newTagClass !== null) {
                tagName.className += service.newTagClass;
            }
            tagName.innerHTML = service.innerHTMLText;
            parent.appendChild(tagName);
            console.log("injectingHTML");
        } else {
            parent.innerHTML += "\n" + service.innerHTMLText;
            console.log("injectingHTML");
        }
    },
    injectJS: function(service) {
      // JSParentTagName(optional)(defaut: 'head')- usually JS is injected into '<head>' but if you want to
      // inject under someother node then specify.
      // jsLocation(required)(default: '#') - location of js file which is to be injected

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = service.fileJS;
        document.getElementsByTagName(service.JSParentTagName)[service.JSParentTagNameIndex].appendChild(script);
        console.log("injectingJS");
    },
};
annolet.buttonHTML = "";
annolet.createButtons = function(service) {
    annolet.buttonHTML += "<li id='annolet' class=annolet-tools-menu-item onclick=" + service.eventOnClick + ">" + service.menuButtonName + "</li>";
    console.log("butons created");
};
annolet.createUI = function(){
  var menuUI = annolet.metafile.initial[0];
  menuUI.innerHTMLText = "<ul id='annolet' class=annolet-tools-menu><span id='annolet' style='border-radius:10px; color:orange;font-weight:bold;font-family:monospace; font-size:1.3em'>AnnoLet!</span><span id='annolet' style='color:grey;'>|</span>"+ annolet.buttonHTML +"<li id='annolet' class=annolet-tools-menu-item id=exit-btn >exit</li></ul>";
  annolet.inject.injectCSS(menuUI);
  annolet.inject.injectHTML(menuUI);
  annolet.inject.injectJS(menuUI);
  console.log("ui created");
};
