import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import type { Activity } from "../types";
import type { FieldValues } from "react-hook-form";

export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();
  const location = useLocation();

  const { data: activities, isPending } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const response = await agent.get<Activity[]>("/activities");
      return response.data;
    },
    enabled: !id && location.pathname === "/activities", // Only run this query if id is not provided and we are on the activities list page
  });

  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["activities", id],
    queryFn: async () => {
      const response = await agent.get<Activity>(`/activities/${id}`);
      return response.data;
    },
    // Only run if id is truthy and not the literal word "activityId"
    enabled: !!id && id !== "activityId",
  });

  const updateActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      const response = await agent.put("/activities", activity);
      return response.data;
    },
    onSuccess: async () => {
      // Invalidate the activities query to refetch data
      await queryClient.invalidateQueries({
        queryKey: ["activities"],
      });
    },
  });

 const createActivity = useMutation({
    mutationFn: async (activity: FieldValues) => {
        const response = await agent.post<string>('/activities', activity);
        
        // 👈 Ensure you return just the string, not the Axios object
        // (If your agent.ts already unwraps .data globally, just return response)
        return typeof response === 'string' ? response : response.data; 
    },
    onSuccess: async () => {
        await queryClient.invalidateQueries({
            queryKey: ['activities']
        });
    }
});

  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      await agent.delete(`/activities/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activities"],
      });
    },
  });

  return {
    activities,
    isPending,
    updateActivity,
    createActivity,
    deleteActivity,
    activity,
    isLoadingActivity,
  };
};
