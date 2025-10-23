import { apiService } from "@/services/api";
import type { BasicInfo, Details } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useDepartments = (searchQuery: string) => {
  return useQuery({
    queryKey: ["departments", searchQuery],
    queryFn: () => apiService.getDepartments(searchQuery),
    enabled: searchQuery.length > 0,
  });
};

export const useLocations = (searchQuery: string) => {
  return useQuery({
    queryKey: ["locations", searchQuery],
    queryFn: () => apiService.getLocations(searchQuery),
    enabled: searchQuery.length > 0,
  });
};

export const useEmployees = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: apiService.getAllEmployees,
    enabled,
  });
};

export const useBasicInfo = () => {
  return useQuery({
    queryKey: ["basicInfo"],
    queryFn: apiService.getBasicInfo,
  });
};

export const useDetails = () => {
  return useQuery({
    queryKey: ["details"],
    queryFn: apiService.getDetails,
  });
};

export const useSubmitBasicInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BasicInfo) => apiService.postBasicInfo(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["basicInfo"] });

      console.log("Basic info submitted successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to submit basic info:", error);
    },
  });
};

export const useSubmitDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Details) => apiService.postDetails(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["details"] });

      console.log("Details submitted successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to submit details:", error);
    },
  });
};

export const useSubmitEmployee = () => {
  const queryClient = useQueryClient();
  const submitBasicInfo = useSubmitBasicInfo();
  const submitDetails = useSubmitDetails();

  const submitEmployee = async (basicInfo: BasicInfo, details: Details) => {
    try {
      // Step 1: Submit basic info
      await submitBasicInfo.mutateAsync(basicInfo);

      // Step 2: Submit details
      await submitDetails.mutateAsync({
        ...details,
        email: basicInfo.email,
        employeeId: basicInfo.employeeId,
      });

      queryClient.invalidateQueries({ queryKey: ["employees"] });

      return { success: true };
    } catch (error) {
      console.error("Failed to submit employee:", error);
      throw error;
    }
  };

  return {
    submitEmployee,
    isSubmittingBasicInfo: submitBasicInfo.isPending,
    isSubmittingDetails: submitDetails.isPending,
    isSubmitting: submitBasicInfo.isPending || submitDetails.isPending,
    basicInfoSuccess: submitBasicInfo.isSuccess,
    detailsSuccess: submitDetails.isSuccess,
    isSuccess: submitBasicInfo.isSuccess && submitDetails.isSuccess,
    error: submitBasicInfo.error || submitDetails.error,
    reset: () => {
      submitBasicInfo.reset();
      submitDetails.reset();
    },
  };
};

