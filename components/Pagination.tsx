"use client";

import { useRouter } from "next/navigation";

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

  const handlePageChange = (newPage: number) => {
    router.push(`?query=${query}&page=${newPage}`);
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
