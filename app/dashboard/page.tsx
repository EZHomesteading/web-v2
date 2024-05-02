import { Card, CardContent, CardHeader } from "../components/ui/card";

const Dashboard = () => {
  return (
    <main className="grid grid-rows-[auto_auto_1fr] h-fit md:h-screen pt-1 md:pt-12 gap-3 px-3 pb-3 md:grid-rows-[auto_auto_1fr]">
      <h1 className="text-3xl font-bold mb-3">Dashboard</h1>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5 md:gap-x-3">
        <Card className="w-full aspect-square sheet shadow-lg">
          <CardHeader>Total Sales</CardHeader>
          <CardContent className="sheet"></CardContent>
        </Card>
        <Card className="w-full aspect-square sheet shadow-lg">
          <CardHeader>Ongoing Sell Orders</CardHeader>
          <CardContent className="sheet"></CardContent>
        </Card>
        <Card className="w-full aspect-square sheet shadow-lg">
          <CardHeader>Ongoing Buy Orders</CardHeader>
          <CardContent className="sheet"></CardContent>
        </Card>
        <Card className="w-full aspect-square sheet shadow-lg">
          <CardHeader>Followers</CardHeader>
          <CardContent className="sheet"></CardContent>
        </Card>
        <Card className="w-full aspect-square sheet shadow-lg">
          <CardHeader>Project Your Harvest</CardHeader>
          <CardContent className="sheet"></CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="w-full sheet shadow-lg md:col-span-2">
          <CardHeader>Overview</CardHeader>
          <CardContent className="sheet"></CardContent>
        </Card>
        <Card className="w-full sheet shadow-lg">
          <CardHeader>Recent Sales</CardHeader>
          <CardContent className="sheet"></CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
