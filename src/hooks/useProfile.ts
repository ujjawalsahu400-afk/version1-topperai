import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profile/profileService";
import { useProfileStore } from "@/store/profileStore";
import { UserProfile } from "@/types/profile";

export const useProfile = (uid?: string) => {
  const queryClient = useQueryClient();
  const { setProfile } = useProfileStore();

  const profileQuery = useQuery({
    queryKey: ["profile", uid],
    queryFn: async () => {
      if (!uid) return null;
      const data = await profileService.getProfile(uid);
      if (data) setProfile(data);
      return data;
    },
    enabled: !!uid,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<UserProfile>) => {
      if (!uid) throw new Error("User ID is required");
      return profileService.updateProfile(uid, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", uid] });
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: (uri: string) => {
      if (!uid) throw new Error("User ID is required");
      return profileService.uploadProfilePhoto(uid, uri);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", uid] });
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isUpdating: updateProfileMutation.isPending,
    isUploading: uploadPhotoMutation.isPending,
    updateProfile: updateProfileMutation.mutateAsync,
    uploadPhoto: uploadPhotoMutation.mutateAsync,
  };
};

export const useUserSearch = () => {
  const { setSearchedUser } = useProfileStore();

  return useMutation({
    mutationFn: (userId: string) => profileService.searchUserById(userId),
    onSuccess: (data) => {
      setSearchedUser(data);
    },
  });
};
