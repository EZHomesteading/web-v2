import MapTester from "../../components/map/MapTestcurrent";
import getCurrentUser from "@/app/actions/getCurrentUserAsync";
const Home = async () => {
  const currentUser = await getCurrentUser();
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
