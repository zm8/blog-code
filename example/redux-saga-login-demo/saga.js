import { delay, takeLatest, CANCEL} from 'redux-saga';
import { put, takeEvery, all, cancelled, take, fork, cancel, call, select} from 'redux-saga/effects';

function fetchApi(val){
    return new Promise( (resolve, reject)=>{
        setTimeout(()=>{
            resolve(val.username + '/' + val.password);
        }, 3000);
    });
}

async function fetchData(val){
    let res;
    try{
        res = await fetchApi(val);
    }catch(e){
        throw e;
    }
    return res;
}

function *doLogin(val){
    try{
        const data = yield call(fetchData, val);
        yield put({type: 'LOGIN_SUCCESS', loginRes: data});
    }catch(e){
        yield put({type: 'LOGIN_FAIL', loginRes: e});
    }finally{
        if (yield cancelled()){
            console.log('cancel');
        }
    }
}

function* watchLogin(){
    while(true){
        const {payload} = yield take('LOGIN_ING');
        // task 是个对象, 里面包含了一些内部的方法
        // 若定义了 task.cancel=()=>{} 方法, 则 doLogin 的就进不到 finnaly 的cancel 方法里面
        const task = yield fork(doLogin, payload);
        const action = yield take(['LOGIN_OUT', 'LOGIN_CANCEL']);
        if(action.type === 'LOGIN_CANCEL'){
            yield cancel(task);
        }
        console.log('当前已经退出登录');
    }
}

export default function* rootSaga(){
    yield all([
        watchLogin(),
    ]);
}