import React from 'react';
import { withRouter } from 'react-router-dom';

export default withRouter(({ history }) => {
  return (
    <div className='container'>
      <button onClick={() => history.push('/game')} type='button'>
        Connect Wallet
      </button>
    </div>
  );
});
