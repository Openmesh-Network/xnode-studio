"use client"

import Lottie from 'react-lottie-player';
import lottieJson from '../../public/images/reviewYourBuild/successPageAnimation.json';

const SuccessPage = () => {
  return (
    <div className="success-container">
      <Lottie
        className="lottie-player"
        loop
        animationData={lottieJson}
        play
      />
    </div>
  );
};
      
export default SuccessPage;
