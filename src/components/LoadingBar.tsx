import { useIsFetching, useIsMutating } from '@tanstack/react-query'

export default function LoadingBar() {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()
  const isLoading = isFetching > 0 || isMutating > 0

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5">
      <div
        className={`h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out ${isLoading ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
      />
    </div>
  )
}
