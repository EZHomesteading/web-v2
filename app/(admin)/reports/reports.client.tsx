"use client";
//admin only reports page
import { useCallback, useEffect, useState } from "react";
import { Outfit } from "next/font/google";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export type Report = {
  reports: number | null;
  id: string;
  review: boolean | null;
};
interface p {
  reports: Report[];
}

const ReportComponent = ({ reports }: p) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (reports) {
      setIsLoading(false);
    }
  }, [reports]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!reports || reports.length === 0) {
    return <div>No reports found</div>;
  }
  const Delete = useCallback(
    (id: string) => {
      setDeletingId(id);
      axios
        .delete(`/api/listing/adminDelete/${id}`)
        .then(() => {
          toast.success("Listing deleted");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error);
        })
        .finally(() => {
          setDeletingId("");
          router.refresh();
        });
    },
    [router]
  );
  const markOk = useCallback(
    (report: Report) => {
      axios
        .post("/api/listing/updateListing", {
          id: report.id,
          reports: null,
          review: null,
        })
        .then(() => {
          toast.success("Reports marked as invalid");
        })
        .catch(() => toast.error("Something went wrong!"))
        .finally(() => router.refresh());
    },
    [router]
  );
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="grid grid-cols-5 fixed top-0 left-0 right-0 items-start bg-gray-800 text-white py-2">
        <div className="col-span-1 text-center">Reported listing Id</div>
        <div className="col-span-1 text-center">Number of reports</div>
        <div className="col-span-1 text-center">Custom Listing Title</div>
        <div className="col-span-1 text-center">Options</div>
      </div>

      <div className="pt-12">
        {" "}
        {reports.map((report: Report) => (
          <div key={report.id} className="grid grid-cols-5 items-start py-2 ">
            <Link
              className="col-span-1 text-center"
              href={`/listings/${report.id}`}
            >
              <Button>{report.id}</Button>
            </Link>

            <div className="col-span-1 text-center">{report.reports}</div>
            <div className="col-span-1 text-center">
              {report.review ? "true" : "false"}
            </div>
            <div className="flex flex-row col-span-1 text-center ">
              <Button className="mr-2" onClick={() => Delete(report.id)}>
                Delete Listing
              </Button>
              <Button onClick={() => markOk(report)}>Mark as okay</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportComponent;
