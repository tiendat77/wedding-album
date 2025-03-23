import './Background.css';

const Background = () => {
  return (
    <div className="bg-hero absolute top-0 right-0 bottom-0 left-0 z-0 overflow-clip opacity-40">
      <div className="bg-grad absolute top-[-50%] left-[50%] h-[150vh] w-[150vh] opacity-90"></div>
      <div className="bg-grad absolute top-0 left-[-50%] h-[150vh] w-[150vh] opacity-50"></div>
      <div className="bg-noise absolute top-0 right-0 bottom-0 left-0 opacity-80 blur-sm"></div>
    </div>
  );
};

export default Background;
