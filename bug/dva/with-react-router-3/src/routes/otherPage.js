import React from 'react';
import { Link  } from 'dva/router';

export default function(){
    return (<div>
        <h1>Other Page</h1>
        <Link to="/">homePage</Link>
    </div>)
}