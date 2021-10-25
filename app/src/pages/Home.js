import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import './Home.css';

export default withRouter(({ history }) => {

  const onLikePress = useCallback(() => {
    history.push('/game');
  }, [history]);

  return (
    <section className="container mx-auto min-h-screen flex flex-col">

      <div className="min-h-screen flex flex-col justify-center">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          Connect your Ethereum wallet and give us a like!
        </div>

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-6 py-2 px-4 rounded max-w-xs mx-auto" onClick={onLikePress}>
          Like!
        </button>
      </div>
    </section>
  );
});
