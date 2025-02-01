"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const Pagination = ({
  totalPages,
  currentPage,
  query,
}: {
  totalPages: number;
  currentPage: number;
  query: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const newQueryParams = new URLSearchParams(searchParams.toString());
    newQueryParams.set("query", query);
    newQueryParams.set("page", newPage.toString());

    router.push(`?${newQueryParams.toString()}`, { scroll: false });
  };

  return (
    <div className="pagination mt-10 flex gap-4">
      {currentPage > 1 && (
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="pagination-button"
        >
          Previous
        </button>
      )}

      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`pagination-button ${pageNumber === currentPage ? "active" : ""}`}
          >
            {pageNumber}
          </button>
        );
      })}

      {currentPage < totalPages && (
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="pagination-button"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;
