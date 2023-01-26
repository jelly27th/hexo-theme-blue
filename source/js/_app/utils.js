/**
 * @param {*} min Random Integer Lower Bound
 * @param {*} max Random integer cap
 * @returns Get random integer.
 */
const getRndInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @returns Child selector `main > .inner` 's offsetHeight
 */
const getDocHeight = function () {
  return $('main > .inner').offsetHeight;
}

/**
 * @param {string} url see themes.vendors.js.
 * @param {string} callback a callback function.
 * @param {string} condition window object.
 * @brief Get a script label and import third party dependence from url.
 * @link https://gist.github.com/marcus-at-localhost/da0cc3da4bfa70399963a4bd32b9e5bf
 */
const getScript = function(url, callback, condition) {
  if (condition) {
    callback();
  } else {
    var script = document.createElement('script');
    script.onload = script.onreadystatechange = function(_, isAbort) {
      if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
        script.onload = script.onreadystatechange = null;
        script = undefined;
        if (!isAbort && callback) setTimeout(callback, 0);
      }
    };
    script.src = url;
    document.head.appendChild(script);
  }
}

/**
 * @param {string} asset theme.css `js` or theme.css `css`. 
 * @param {string} type  Global variable `LOCAL` 's parameter.
 * @returns if url start with npm、gh、combine, use jsdelivr to speed up
 *          third party dependence, else return original url.
 */
const assetUrl = function(asset, type) {
  var str = CONFIG[asset][type]
  if(str.indexOf('npm')>-1||str.indexOf('gh')>-1||str.indexOf('combine')>-1)
    return "//cdn.jsdelivr.net/" + str

  if(str.indexOf('http')>-1)
    return str

  // `statics` see .../_app/global.js  
  return statics + str;
}

/**
 * @param {string} type  `LOCAL` or `window` or `CONFIG` object.  
 * @param {string} callback if no callback is provided, defaults window object is exist.
 * @param {string} condition `window` object. if no condition is provided, 
 *                            defaults use `window[type]`.
 * @brief Get a script label and import third party dependence from url.
 */
const vendorJs = function(type, callback, condition) {
  if(LOCAL[type]) {
    getScript(assetUrl("js", type), callback || function(){
      window[type] = true;
    }, condition || window[type]);
  }
}

/**
 * @param {*} type  `LOCAL` or `window` or `CONFIG` object.  
 * @param {*} condition `window` object but not use it in this function.
 * @brief Generate link label import third party css according to `type`
 */
const vendorCss = function(type, condition) {
  if(window['css'+type])
    return;

  if(LOCAL[type]) {

    document.head.createChild('link', {
      rel: 'stylesheet',
      href: assetUrl("css", type)
    });

    window['css'+type] = true;
  }
}

/**
 * @param {*} element default `document`.
 * @brief Implement pjax loading website.
 */
const pjaxScript = function(element) {
  var code = element.text || element.textContent || element.innerHTML || '';
  var parent = element.parentNode;
  parent.removeChild(element);
  var script = document.createElement('script');
  if (element.id) {
    script.id = element.id;
  }
  if (element.className) {
    script.className = element.className;
  }
  if (element.type) {
    script.type = element.type;
  }
  if (element.src) {
    script.src = element.src;
    // Force synchronous loading of peripheral JS.
    script.async = false;
  }
  if (element.dataset.pjax !== undefined) {
    script.dataset.pjax = '';
  }
  if (code !== '') {
    script.appendChild(document.createTextNode(code));
  }
  parent.appendChild(script);
}

/**
 * @param {*} complete a custom function.
 * @brief record page scroll position. 
 */
const pageScroll = function(target, offset, complete) {
  var opt = {
    targets: typeof offset == 'number' ? target.parentNode : document.scrollingElement,
    duration: 500,
    easing: "easeInOutQuad",
    scrollTop: offset || (typeof target == 'number' ? target : (target ? target.top() + document.documentElement.scrollTop - siteNavHeight : 0)),
    complete: function() {
      complete && complete()
    }
  }
  anime(opt);
}

/** 
 * @param {*} type `0` or `1` or `bounceUpIn` or `shrinkIn` or 
 *                 `slideRightIn` or `slideRightOut`.
 * @param {*} complete a custom function.
 * @brief  
 */
const transition = function(target, type, complete) {
  var animation = {}
  var display = 'none'
  switch(type) {
    case 0:
      animation = {opacity: [1, 0]}
    break;
    case 1:
      animation = {opacity: [0, 1]}
      display = 'block'
    break;
    case 'bounceUpIn':
      animation = {
        begin: function(anim) {
          target.display('block')
        },
        translateY: [
          { value: -60, duration: 200 },
          { value: 10, duration: 200 },
          { value: -5, duration: 200 },
          { value: 0, duration: 200 }
        ],
        opacity: [0, 1]
      }
      display = 'block'
    break;
    case 'shrinkIn':
      animation = {
        begin: function(anim) {
          target.display('block')
        },
        scale: [
          { value: 1.1, duration: 300 },
          { value: 1, duration: 200 }
        ],
        opacity: 1
      }
      display = 'block'
    break;
    case 'slideRightIn':
      animation = {
        begin: function(anim) {
          target.display('block')
        },
        translateX: [100, 0],
        opacity: [0, 1]
      }
      display = 'block'
    break;
    case 'slideRightOut':
      animation = {
        translateX: [0, 100],
        opacity: [1, 0]
      }
    break;
    default:
      animation = type
      display = type.display
    break;
  }
  anime(Object.assign({
    targets: target,
    duration: 200,
    easing: 'linear'
  }, animation)).finished.then(function() {
      target.display(display)
      complete && complete()
    });
}

/**
 * @link https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage
 * @brief store or read or remove the data.  
*/
const store = {
  get: function(item) {
    return localStorage.getItem(item);
  },
  set: function(item, str) {
    localStorage.setItem(item, str);
    return str;
  },
  del: function(item) {
    localStorage.removeItem(item);
  }
}
