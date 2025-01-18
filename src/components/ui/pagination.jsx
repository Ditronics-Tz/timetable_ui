import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'

export const Pagination = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  siblingCount = 1,
}) => {
  const totalPageCount = Math.ceil(totalCount / pageSize)

  const range = (start, end) => {
    let length = end - start + 1
    return Array.from({ length }, (_, idx) => idx + start)
  }

  const DOTS = '...'

  const paginationRange = React.useMemo(() => {
    const totalPageNumbers = siblingCount + 5

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    )

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPageCount

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount
      let leftRange = range(1, leftItemCount)

      return [...leftRange, DOTS, totalPageCount]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      )
      return [firstPageIndex, DOTS, ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
    }
  }, [totalCount, pageSize, siblingCount, currentPage])

  if (currentPage === 0 || paginationRange.length < 2) {
    return null
  }

  const onNext = () => {
    onPageChange(currentPage + 1)
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
  }

  let lastPage = paginationRange[paginationRange.length - 1]

  return (
    <ul className="flex list-none">
      <li>
        <Button
          variant="outline"
          size="icon"
          className={`${
            currentPage === 1 ? 'pointer-events-none opacity-50' : ''
          }`}
          onClick={onPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </li>
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <li key={index} className="px-2 py-1">
              &#8230;
            </li>
          )
        }

        return (
          <li key={index}>
            <Button
              variant={pageNumber === currentPage ? 'default' : 'outline'}
              size="icon"
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          </li>
        )
      })}
      <li>
        <Button
          variant="outline"
          size="icon"
          className={`${
            currentPage === lastPage ? 'pointer-events-none opacity-50' : ''
          }`}
          onClick={onNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </li>
    </ul>
  )
}

