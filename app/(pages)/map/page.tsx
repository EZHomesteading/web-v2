import MapTester from "../../components/map/MapTest";
import getCurrentUser from "@/app/actions/getCurrentUser";
const Home = async () => {
  const currentUser = await getCurrentUser();
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
