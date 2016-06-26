/*
 AUTHOR: Raghav Mittal
 email: raghavmittal101@gmail.com
*/

var annolet = {};

/* contains all UI related items */
annolet.inject = {
  fileCSS: "#",
  index: 0,
  HTMLParentTagName: "body",
  newTagName: null,
  newTagId: null,
  newTagClass: null,
  innerHTMLText: "",
  fileJS: "#",
  JSParentTagName: "head",

  init: function(manifestObject){
    if(manifestObject.fileCSS) this.fileCSS = manifestObject.fileCSS;
    if(manifestObject.index) this.index = manifestObject.index;
    if(manifestObject.HTMLParentTagName) this.HTMLParentTagName = manifestObject.HTMLParentTagName;
    if(manifestObject.newTagName) this.newTagName = manifestObject.newTagName;
    if(manifestObject.newTagId) this.newTagId = manifestObject.newTagId;
    if(manifestObject.newTagClass) this.newTagClass = manifestObject.newTagClass;
    if(manifestObject.innerHTMLText) this.innerHTMLText = manifestObject.innerHTMLText;
    if(manifestObject.fileJS) this.fileJS = manifestObject.fileJS;
    if(manifestObject.JSParentTagName) this.JSParentTagName = manifestObject.JSParentTagName;
  },
  injectCSS: function(cssLocation){
    if(cssLocation){this.fileCSS = cssLocation;}
    var link = document.createElement('link');
    link.href = this.fileCSS + "?v=" + parseInt(Math.random() * 999); //a random mock version number is added everytime file is called to prevent loading of cached css file by browser.
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


    var parent = document.getElementsByTagName(this.HTMLParentTagName)[this.index];
    // if newTagName is given, else append innerHTML to body.
    if(this.newTagName){
      var tagName = document.createElement(this.newTagName);
      if(this.newTagId){tagName.id += ' ' + this.newTagId;}
      if(this.newTagClass){tagName.className += this.newTagClass;}
      tagName.innerHTML = this.innerHTMLText;
      parent.appendChild(tagName);
      }
    else {this.HTMLParentTagName.innerHTML += "\n" + this.innerHTMLText;}
  },

  injectJS: function(JSParentTagName, jsLocation){

    /*
      JSParentTagName(optional)(defaut: 'head')- usually JS is injected into '<head>' but if you want to
      inject under someother node then specify.
      jsLocation(required)(default: '#') - location of js file which is to be injected
    */

    if(JSParentTagName){this.JSParentTagName = JSParentTagName;}
    if(jsLocation){this.fileJS = jsLocation;} else {throw "jsLocation required"}
    var script = document.createElement("script");
    script.type="text/javascript"
    script.src = this.fileJS;
    document.getElementsByTagName(this.JSParentTagName)[0].appendChild(script);
  },
}

annolet.xpath = {
    xpath: null,
    element: null,

    // function to get Xpath to passed element
    get: function(element) {
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

annolet.handlers = {
  // function which provides event handler for webservices which want to get mouse clicks
  // it returns the element clicked and root of the document which is in case of HTML DOMs is often '<html>' tag
  /*
  BUG:
  not returning target and root to annolt.target and annolet.root
  */
  target: '',
  root: '',
  mousetrack: function(){
    document.onclick = function(event) {
    if (event === undefined) {
    event = window.event;
    } // for IE
    var target = 'target' in event ? event.target : event.srcElement; // for IE
    var root = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
    }

    this.target = target;
    this.root = root;
  },
}

annolet.parser = {
// getManifest
//  parseManifest
}

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
