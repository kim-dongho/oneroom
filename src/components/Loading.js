import Loader from 'react-loader-spinner';
import './Loading.css';
const Loading = () => {
  return (
    <div className='loader'>
      <Loader type='TailSpin' color='#00BFFF' height={100} width={100} />
      <span>Loading...</span>
    </div>
  );
};

export default Loading;
