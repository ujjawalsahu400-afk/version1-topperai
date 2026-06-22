import { useQuery } from "@tanstack/react-query";
import { homeService } from "@/services/home/homeService";
import { useHomeStore } from "@/store/homeStore";

export const useDashboard = (uid?: string) => {
  const { setDashboardData } = useHomeStore();

  return useQuery({
    queryKey: ["dashboard", uid],
    queryFn: async () => {
      if (!uid) return null;
      const data = await homeService.getDashboardData(uid);
      setDashboardData(data);
      return data;
    },
    enabled: !!uid,
  });
};
