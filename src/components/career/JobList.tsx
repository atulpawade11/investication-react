import JobCard from "./JobCard";

type Props = {
  jobs: any[];
};

export default function JobList({ jobs }: Props) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-gray-200 rounded-xl">
        <p className="text-gray-400 font-medium">No positions match your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {jobs.map((job: any) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}