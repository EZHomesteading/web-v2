const Page = () => {
  return (
    <>
      <div className="animated-background"></div>
      <style jsx>{`
        .animated-background {
          width: 100%;
          height: 100vh;
          background: linear-gradient(to right, #e3eac9, #ced9bb);
          background-size: 200% 200%;
          animation: gradientAnimation 5s ease infinite;
        }

        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  );
};

export default Page;
