export default {
    namespace: 'other',
  
    state: {},
  
    subscriptions: {
      setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
          if(pathname === '/otherPage'){
              console.log('otherPage');
          }
        });
      },
    },
  
    effects: {
      
    },
  
    reducers: {
      
    },
  };
  