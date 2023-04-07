import useSWR from "swr"
import fetcher from "@/lib/fetcher"
import { revalidateEvents } from "swr/_internal"

const useBillboard = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/random', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  return {
    data, error, isLoading, mutate
  }
}

export default useBillboard
