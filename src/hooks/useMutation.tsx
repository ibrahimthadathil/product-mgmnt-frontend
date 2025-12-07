import { useMutation, useQueryClient } from "@tanstack/react-query";

export function UseRMutation<T, B>(
  key: string,
  executer: (body: B) => Promise<{ data: T }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [key],
    mutationFn: async (body: B) => {
      const { data } = await executer(body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
}
