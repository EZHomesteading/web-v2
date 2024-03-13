import { Button } from "../../components/ui/button";
import MapTester from "../../components/map/MapTestcurrent";
import currentUser from "@/app/actions/getCurrentUser";
const Home = async () => {
  return (
    <div>
      <main>
        <div>
          {/* <h1>Map Test Page</h1> */}
          <MapTester currentUser={currentUser} />
        </div>
      </main>
    </div>
  );
};

export default Home;
