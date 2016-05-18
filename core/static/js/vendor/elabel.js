// ELabel.js
//
//   This Javascript is provided by Mike Williams
//   Blackpool Community Church Javascript Team
//   http://www.commchurch.freeserve.co.uk/
//   http://econym.googlepages.com/index.htm
//
//   This work is licenced under a Creative Commons Licence
//   http://creativecommons.org/licenses/by/2.0/uk/
//
// Version 0.2      the .copy() parameters were wrong
// version 1.0      added .show() .hide() .setContents() .setPoint() .setOpacity() .overlap
// version 1.1      Works with GMarkerManager in v2.67, v2.68, v2.69, v2.70 and v2.71
// version 1.2      Works with GMarkerManager in v2.72, v2.73, v2.74 and v2.75
// version 1.3      add .isHidden()
// version 1.4      permit .hide and .show to be used before addOverlay()
// version 1.5      fix positioning bug while label is hidden
// version 1.6      added .supportsHide()
// version 1.7      fix .supportsHide()

// version 1.8      port for use with Google Maps API v3 (Scott Alexander & Rob Day-Reynolds)


function ELabel(point, html, classname, pixelOffset, percentOpacity, overlap) {
  // Mandatory parameters
  this.point = point;
  this.html = html;

  // Optional parameters
  this.classname = classname||"";
  this.pixelOffset = pixelOffset||new google.maps.Size(0,0);
  if (percentOpacity) {
    if(percentOpacity<0){percentOpacity=0;}
    if(percentOpacity>100){percentOpacity=100;}
  }
  this.percentOpacity = percentOpacity;
  this.overlap=overlap||false;
  this.hidden = false;
}

ELabel.prototype = new google.maps.OverlayView();

ELabel.prototype.onAdd = function(map) {
  var div = document.createElement("div");
  var divName = 'map_label';
  div.style.position = "absolute";
  div.innerHTML = '<div class="' + this.classname + '" name="' + divName + '">' + this.html + '</div>' ;
  this.getPanes().floatShadow.appendChild(div);
  this.div_ = div;
  if (this.percentOpacity) {
    if(typeof(div.style.filter)=='string'){div.style.filter='alpha(opacity:'+this.percentOpacity+')';}
    if(typeof(div.style.KHTMLOpacity)=='string'){div.style.KHTMLOpacity=this.percentOpacity/100;}
    if(typeof(div.style.MozOpacity)=='string'){div.style.MozOpacity=this.percentOpacity/100;}
    if(typeof(div.style.opacity)=='string'){div.style.opacity=this.percentOpacity/100;}
  }
//  if (this.overlap) {
//    var z = google.maps.OverlayView.getZIndex(this.point.lat());
//    this.div_.style.zIndex = z;
//  }
  if (this.hidden) {
    this.hide();
  }
};

ELabel.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
};

ELabel.prototype.copy = function() {
  return new ELabel(this.point, this.html, this.classname, this.pixelOffset, this.percentOpacity, this.overlap);
};

ELabel.prototype.draw = function(force) {
    var projection = this.getProjection(),
        p = projection.fromLatLngToDivPixel(this.point);
  var h = parseInt(this.div_.clientHeight);
  this.div_.style.left = (p.x + this.pixelOffset.width) + "px";
  this.div_.style.top = (p.y +this.pixelOffset.height - h) + "px";
};

ELabel.prototype.show = function() {
  if (this.div_) {
    this.div_.style.display="";
    this.draw();
  }
  this.hidden = false;
};

ELabel.prototype.hide = function() {
  if (this.div_) {
    this.div_.style.display="none";
  }
  this.hidden = true;
};

ELabel.prototype.isHidden = function() {
  return this.hidden;
};

ELabel.prototype.supportsHide = function() {
  return true;
};

ELabel.prototype.setContents = function(html) {
  this.html = html;
  this.div_.innerHTML = '<div class="' + this.classname + '">' + this.html + '</div>' ;
  this.draw(true);
};

ELabel.prototype.setPoint = function(point) {
  this.point = point;
  if (this.overlap) {
    var z = google.maps.OverlayView.getZIndex(this.point.lat());
    this.div_.style.zIndex = z;
  }
  this.draw(true);
};

ELabel.prototype.setOpacity = function(percentOpacity) {
  if (percentOpacity) {
    if(percentOpacity<0){percentOpacity=0;}
    if(percentOpacity>100){percentOpacity=100;}
  }
  this.percentOpacity = percentOpacity;
  if (this.percentOpacity) {
    if(typeof(this.div_.style.filter)=='string'){this.div_.style.filter='alpha(opacity:'+this.percentOpacity+')';}
    if(typeof(this.div_.style.KHTMLOpacity)=='string'){this.div_.style.KHTMLOpacity=this.percentOpacity/100;}
    if(typeof(this.div_.style.MozOpacity)=='string'){this.div_.style.MozOpacity=this.percentOpacity/100;}
    if(typeof(this.div_.style.opacity)=='string'){this.div_.style.opacity=this.percentOpacity/100;}
  }
};

ELabel.prototype.getPoint = function() {
  return this.point;
};
ELabel.prototype.U = function() {
  return this.point;
};
ELabel.prototype.V = function() {
  return this.point;
};
ELabel.prototype.W = function() {
  return this.point;
};
ELabel.prototype.X = function() {
  return this.point;
};
ELabel.prototype.Y = function() {
  return this.point;
};
ELabel.prototype.Z = function() {
  return this.point;
};