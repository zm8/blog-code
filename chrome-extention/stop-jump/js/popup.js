start({
    $btn: document.getElementById('btn_stop'),
    tabName: TAB_STATUS_1,
    execJS: 'js/execStop.js',
});

start({
    $btn: document.getElementById('btn_debug'),
    tabName: TAB_STATUS_2,
    execJS: 'js/execDebug.js',
});

async function start({$btn, tabName, execJS}){
    let tabVal = await syncGet(tabName);

    await toggleTab($btn, tabName, tabVal);
    $btn.addEventListener('click', async ()=>{
        let tabVal = await syncGet(tabName);
        await toggleTab($btn, tabName, !tabVal);
        // 先赋值 tabVal, 再executeScript
        executeScript(execJS);
    });
}

function executeScript(execFile){
    chrome.tabs.executeScript({
        file: execFile,
    }, _=>chrome.runtime.lastError);
    // chrome.tabs.executeScript({
    //     code: 'freeeLocation()'
    // })
}

async function toggleTab($btn, tabName, value){
    value ? addClass($btn, 'ant-switch-checked') : removeClass($btn, 'ant-switch-checked');
    await syncSet({[tabName]: value});
}