import React from 'react';
import { Link } from 'react-router-dom';
const Enter = () => {
  return (
    <div>
      <button>
        <Link to='/auth'>등록</Link>
      </button>
      <button>
        <Link to='/home'>구경</Link>
      </button>
    </div>
  );
};

export default Enter;
