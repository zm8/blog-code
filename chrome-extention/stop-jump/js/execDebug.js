;(async function(){
    let tab2_val = await syncGet(TAB_STATUS_2);
    tab2_val ? showTipRunning() : removeListenerDebug();
})();
