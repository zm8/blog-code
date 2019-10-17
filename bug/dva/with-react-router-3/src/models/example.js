export default {
  namespace: 'example',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if(pathname === '/'){
          console.log('homePage');
        }
      });
    },
  },

  effects: {
    
  },

  reducers: {
    
  },
};
