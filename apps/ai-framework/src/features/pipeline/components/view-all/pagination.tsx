import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination';

interface PaginationContainerProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationContainer({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
}: PaginationContainerProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // 生成頁數陣列
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // 如果總頁數少於等於最大顯示頁數，顯示所有頁數
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 複雜的分頁邏輯
      if (currentPage <= 3) {
        // 當前頁在前面
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        // 當前頁在後面
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 當前頁在中間
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const showFirstEllipsis = pageNumbers[0] > 1;
  const showLastEllipsis = pageNumbers[pageNumbers.length - 1] < totalPages;

  if (totalPages <= 1) {
    return null; // 如果只有一頁或沒有資料，不顯示分頁
  }

  return (
    <div className="flex justify-center py-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePrevious}
              className={
                currentPage === 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {showFirstEllipsis && (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageClick(1)}
                  className="cursor-pointer"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {pageNumbers.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageClick(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {showLastEllipsis && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageClick(totalPages)}
                  className="cursor-pointer"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={handleNext}
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
