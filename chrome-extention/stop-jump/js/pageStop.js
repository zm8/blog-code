;(async function(){
    let tab1_val = await syncGet(TAB_STATUS_1);
    if(tab1_val){
        showTipRunning();
        freeeLocation();
    }
})();

