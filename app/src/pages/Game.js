import React, { useRef } from 'react';
import { withRouter } from 'react-router-dom';

import { useGame } from '../hooks/useGame';
import gameConfig from '../game/game';

export default withRouter(() => {
  const parentEl = useRef(null);
  useGame(gameConfig, parentEl);

  return (
    <section className="min-h-screen flex flex-col">
      <div ref={parentEl} className="flex-1" />
    </section>
  );
});
