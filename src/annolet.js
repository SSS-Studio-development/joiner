/*
 AUTHOR: Raghav Mittal
 email: raghavmittal101@gmail.com
*/

var annolet = {};

/* contains all UI related items */
annolet.ui = {
  index: 0,
  parentTagName: "body",
  newTagName: null,
  newTagId: null,
  newTagClass: null,
  fileCSS: "#",
  innerHTMLText: '',

  injectCSS: function(){
    var link = document.createElement('link');
    link.href = this.fileCSS + "?v=" + parseInt(Math.random() * 999); //a random mock version number is added everytime file is called to prevent loading of cached css file by browser.
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName('head')[0].appendChild(link);
  },

  /*
    parentTagName: name of parent node (optional)(default: body)
    index: index of parent node under which new element will be created(optional)(default: 0)
    newTagName: name of new child node to be created(optinal)(default: appends HTML to body)
    newTagId: id of newTagName (optional)(default: NULL)
    newTagClass: className of newTagName (optional)(default: NULL)
    innerHTML: html to be inserted into DOM. (required)

    if you dont want to add new child, then dont provide newTagId, newTagName, newTagClass
  */
  injectHTML: function(){
  var parent = document.getElementsByTagName(this.parentTagName)[this.index];
  // if newTagName is given, else append innerHTML to body.
  if(this.newTagName){
    var tagName = document.createElement(this.newTagName);
    if(this.newTagId){tagName.id += ' ' + this.newTagId;}
    if(this.newTagClass){tagName.className += this.newTagClass;}
    tagName.innerHTML = this.innerHTMLText;
    this.parentTagName.appendChild(tagName);
    }
    else {this.parentTagName.innerHTML += "\n" + this.innerHTMLText;}
  },
}

annolet.xpath = {
    xpath: null,
    element: null,

    // function to get Xpath to passed element
    get: function() {
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
    evaluate: function() {
        return document.evaluate(this.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    },

}

// function which provides event handler for webservices which want to get mouse clicks
// it returns the element clicked and root of the document which is in case of HTML DOMs is often '<html>' tag

/*
BUG:
  not returning target and root to annolt.target and annolet.root
*/
annolet.handlers =
{
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

// it contains all the funcitons which will initially run to create container trigger handler etc. fetch data for webservices
annolet.main =
