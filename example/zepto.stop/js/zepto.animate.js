// $.fn.stop
;(function($){
  var supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
  var transform = getTransformPrefix();

  function getStyle(el, property){
    var element = el, computedStyle = window.getComputedStyle(element, '')
    if(!element) return
    if (typeof property == 'string')
      return computedStyle.getPropertyValue(property)
    else if (isArray(property)) {
      var props = {}
      $.each(isArray(property) ? property: [property], function(_, prop){
        props[prop] = computedStyle.getPropertyValue(prop);
      })
      return props
    }
  }
  function getTransformPrefix(){
    var testEl = document.createElement('div');
    var vendors = { Webkit: 'webkit', Moz: '', O: 'o' };
    $.each(vendors, function(vendor, event){
      if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
        prefix = '-' + vendor.toLowerCase() + '-'
        eventPrefix = event
        return false
      }
    })
    testEl = null;
    return prefix + 'transform';
  }

  var stopHandle = function(stopToEnd, execCallback){
    stopToEnd = stopToEnd || false;
    
    // 若没有指定 execCallback
    if(execCallback === undefined){
      if(stopToEnd){
        execCallback = true;
      }else{
        execCallback = false;
      }
    }

    var $this = $(this);
    var data = $this.data('__aniStopObj');
    if(!data){ // already stop
      return;
    }

    clearTimeout(data.aniTimeout);
    var properties = data.properties;
    var callback = data.callback;

    // 直接显示 最终的样式
    if(stopToEnd === true){
      $this.css(properties);
    }else{
      for(var key in properties){
        // 如果是 transform, 则显示transform 样式, 否则显示正常的样式
        if(supportedTransforms.test(key)){
          $this.css(transform, getStyle($this[0], transform) );
        }else{
          $this.css(key, getStyle($this[0], key));
        }
      }
    }
    callback.call(this, undefined, stopToEnd, execCallback);
  }
  $.fn.stop = function(stopToEnd, execCallback){
    return this.each(function(){
      stopHandle.call(this, stopToEnd, execCallback);
    });
  }

})(Zepto);


