import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const SIBLING_COUNT = 1;
const DOTS = "...";

function getPaginationRange(currentPage: number, totalPage: number) {
  const totalPageNumbers = SIBLING_COUNT * 2 + 5; // siblings + first + last + current + 2 dots

  if (totalPageNumbers >= totalPage) {
    return Array.from({ length: totalPage }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - SIBLING_COUNT, 1);
  const rightSiblingIndex = Math.min(currentPage + SIBLING_COUNT, totalPage);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPage - 2;

  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from({ length: 3 + SIBLING_COUNT * 2 }, (_, i) => i + 1);
    return [...leftRange, DOTS, totalPage];
  }

  if (showLeftDots && !showRightDots) {
    const rightRange = Array.from(
      { length: 3 + SIBLING_COUNT * 2 },
      (_, i) => totalPage - (3 + SIBLING_COUNT * 2) + 1 + i
    );
    return [1, DOTS, ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, DOTS, ...middleRange, DOTS, totalPage];
}

const ManagePagination = ({ meta }: any) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = Number(meta?.page);
  const totalPage = Number(meta?.totalPage);

  const updatePage = (page: number) => {
    if (page < 1 || page > totalPage) return;
    const params = new URLSearchParams(location.search);
    params.set("page", page.toString());
    params.set("limit", meta.limit.toString());
    navigate(`?${params.toString()}`);
  };

  const paginationRange = getPaginationRange(currentPage, totalPage);

  return (
    <div className={`${!totalPage ? "hidden" : "flex"} items-center justify-center w-full mt-6`}>
      <div className="flex items-center gap-1.5">

        {/* Prev */}
        <button
          disabled={currentPage === 1 || totalPage === 1}
          onClick={() => updatePage(currentPage - 1)}
          className="flex items-center justify-center size-9 rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all shadow-xs cursor-pointer"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Pages */}
        {paginationRange.map((page, index) => {
          if (page === DOTS) {
            return (
              <span
                key={`dots-${index}`}
                className="flex items-center justify-center size-9 text-slate-400 select-none text-xs font-medium"
              >
                •••
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => updatePage(page as number)}
              className={`flex items-center justify-center size-9 rounded-lg text-xs font-semibold transition-all cursor-pointer
                ${isActive
                  ? "bg-[#0B3C6D] text-white border border-[#0B3C6D] shadow-sm"
                  : "border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 shadow-xs"
                }
              `}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          disabled={currentPage === totalPage || totalPage === 1}
          onClick={() => updatePage(currentPage + 1)}
          className="flex items-center justify-center size-9 rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all shadow-xs cursor-pointer"
        >
          <ChevronRight className="size-4" />
        </button>

      </div>
    </div>
  );
};

export default ManagePagination;