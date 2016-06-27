
var $j = jQuery.noConflict();

annolet_main();

var annolet_btn;
// function to create annolet controls container
function annolet_createContainer() {
    // appending a CSS stylesheet to head of webpage
    var link = document.createElement('link');
    // using rawgit.com MaxCDN.. files directly linked to git repo 'annoletjs/master'
    link.href = "https://cdn.rawgit.com/SSS-Studio-development/annoletjs/master/annolet.css"; //random version number removed bcoz some browser take it as text file and not as CSS.
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName('head')[0].appendChild(link);

    // appending a div to body of webpage
    var body = document.getElementsByTagName('body')[0];
    var annolet_container = document.createElement('div');
    annolet_container.id = 'annolet-container';
    body.appendChild(annolet_container);
    //injecting html code
    document.getElementById('annolet-container').innerHTML = "<ul id='annolet' class=annolet-tools-menu>"+
    "<span id='annolet' style='border-radius:10px;  color:orange;font-weight:bold;font-family:monospace; font-size:1.3em'>AnnoLet!</span>"+
    "<span id='annolet' style='color:grey;'>|</span>"+
    "<li id='annolet' class=annolet-tools-menu-item id=highlight-btn onclick='annolet_btn=1;'>TagIt!</li>"+
    "<li id='annolet' class=annolet-tools-menu-item id=exit-btn onclick='annolet_btn=0;'>exit</li>"+
    "</ul>"; //HTML to create a list of options
}

// function to get Xpath to passed element
function anno_getXpathTo(element) {
    if (element.id !== '') {
        return "//*[@id='" + element.id + "']";
    }
    if (element === document.body) {
        return "html/" + element.tagName.toLowerCase();
    } //added 'html/' to generate a valid Xpath even if parent has no ID.
    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element) {
            return anno_getXpathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
        }
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}

// function to evaluate element from Xpath
function anno_getElementByXpath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

//main function which will execute other functions
function annolet_main() {
    disableAllLinks()  // it will disable all the links present in webpage iteratively
    annolet_createContainer();
    document.onclick = function(event) {
        if (event === undefined) {
            event = window.event;
        } // for IE
        var target = 'target' in event ? event.target : event.srcElement; // for IE
        var root = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
        var xpath = anno_getXpathTo(target);
        if (annolet_btn === 1) {
            anno_highlight(xpath);
        }
    };
}

// funtion to disable all links
function disableAllLinks(){
    var anchors = document.getElementsByTagName("a");
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].onclick = function() {return(false);};
    }
}

//function to store tags into JSON object.
var annolet_obj = 0; //will save jason objects
function annolet_insertIntoObject(xpath) {
  if(annolet_obj==0){
    authorname = prompt('enter authorname');
    annolet_obj = {
        url: window.location.href,
        authorname: authorname,
        tags : []
    };
    tagObject(xpath, annolet_obj);
  }
  else {
    tagObject(xpath, annolet_obj);
  }
}

// function for creation of objects
function tagObject(xpath, obj){
  tagName = prompt('tagName:');
  tagInfo = prompt('tagInfo');
  obj.tags.push(
    {
      tagName: tagName,
      tagInfo: tagInfo,
      xpath: xpath
    }
  )
}

//function for highlighting element
function anno_highlight(xpath) {
    clicked_element = anno_getElementByXpath(xpath)
    //if element is already highlighted
    if (clicked_element.id == "mark" || clicked_element.id == "annolet") {
        console.log('not permitted');
    }
    else {
      // hightlight selected element and store it
      $j(anno_getElementByXpath(xpath)).wrapInner("<span id='mark' style='background:yellow;'></span>");
      annolet_insertIntoObject(xpath); // storing into object
    }
}
