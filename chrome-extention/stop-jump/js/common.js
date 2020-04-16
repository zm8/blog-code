const TAB_STATUS_1 = '__TAB_STATUS_1';
const TAB_STATUS_2 = '__TAB_STATUS_2';

function injectScript(jsStr){
    const el = document.createElement("script");
    el.innerHTML = jsStr;
    document.head.appendChild(el);
}

let $div;
let timeoutDiv;
// 添加 页面提示
function showTip(str){
    if(!$div){
        $div = document.createElement("div");
        addClass($div, '__plugin-jump-cnt');
        document.body.appendChild($div);
    }
    $div.innerHTML = str;

    removeClass($div, 'hide');
    clearTimeout(timeoutDiv);
    timeoutDiv = setTimeout(()=>{
        addClass($div, 'hide');
    }, 1000);
}

function syncSet(obj={}){
    return new Promise(resolve=>{
        chrome.storage.sync.set(obj, ()=>{
            resolve();
        });
    });
}

function syncGet(str=''){
    return new Promise(resolve=>{
        chrome.storage.sync.get(str, result=>{
            resolve(result[str]);
        });
    });
}

function addClass($el, className){
    let list = [...$el.classList];
    list.push(className);
    $el.className = list.join(' ');
    return $el;
}

function removeClass($el, className){
    let list = [...$el.classList];
    list = list.filter(item => item !== className);
    $el.className = list.join(' ');
    return $el;
}

function getAllWindow(){
    const arr = [window];
    let ifr = document.getElementsByTagName('iframe');
    let len = ifr.length;
    for(var i = 0; i < len; i ++){
        arr.push(ifr[i].contentWindow);
    }
    return arr;
}


function addListenerDebug(){
    let str = getAllWindow.toString() + `
        getAllWindow().forEach(win=>{
            win._extendtion_debugFunc = ()=> {debugger;};
            win.addEventListener('beforeunload', win._extendtion_debugFunc);
        });
    `;
    injectScript(str);
}


function removeListenerDebug(){
    let str = getAllWindow.toString() + `
        getAllWindow().forEach(win=>{
            win.removeEventListener('beforeunload', win._extendtion_debugFunc);
        });
    `;
    injectScript(str);
}

// 冻结 window.location
// 注意, 一旦冻结就不能解冻了!!!
function freeeLocation(){
    let str = getAllWindow.toString() + `
        getAllWindow().forEach(win=>{
            Object.freeze(win.location);
        });
    `;
    injectScript(str);
}

function showTipRunning(){
    showTip("Stop-Jump is running");
}