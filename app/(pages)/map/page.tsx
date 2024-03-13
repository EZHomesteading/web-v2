import MapTester from "../../components/map/MapTest";
import currentUser from "@/app/actions/getCurrentUser";
const Home = async () => {
  return (
    <div>
      <main>
        <div>
          <MapTester currentUser={currentUser} />
        </div>
      </main>
    </div>
  );
};

export default Home;
