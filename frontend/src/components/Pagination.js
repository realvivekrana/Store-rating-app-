import React from 'react';

export default function Pagination({
  page,
  totalPages,
  onChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const goToPage = (nextPage) => {
    if (
      nextPage < 1 ||
      nextPage > totalPages
    ) {
      return;
    }

    onChange(nextPage);
  };

  const pages = [];

  for (
    let i = 1;
    i <= totalPages;
    i += 1
  ) {
    pages.push(i);
  }

  return (
    <nav
      className="pagination"
      aria-label="Pagination"
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() =>
          goToPage(page - 1)
        }
      >
        Previous
      </button>

      {pages.map((pageNumber) => (
        <button
          type="button"
          key={pageNumber}
          className={
            pageNumber === page
              ? 'active'
              : ''
          }
          aria-current={
            pageNumber === page
              ? 'page'
              : undefined
          }
          onClick={() =>
            goToPage(pageNumber)
          }
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        disabled={
          page === totalPages
        }
        onClick={() =>
          goToPage(page + 1)
        }
      >
        Next
      </button>
    </nav>
  );
}