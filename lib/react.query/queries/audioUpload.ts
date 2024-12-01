import useCustomQuery, { useCustomMutationV2 } from "../src";

const baseUrl = `/admin/v1`;

export const useListAdmin = <T>(
  page: number,
  search?: string,
  statusFilter?: string,
  userFilter?: string
) => {
  let url =
    search !== "" && statusFilter === "" && userFilter === ""
      ? `&search=${search}`
      : search === "" && statusFilter !== "" && userFilter === ""
      ? `&status=${statusFilter}`
      : search === "" && statusFilter === "" && userFilter !== ""
      ? `&role=${userFilter}`
      : ``;

  return useCustomQuery<T>(
    ["useListAdmin", page, search, statusFilter, userFilter],
    `${baseUrl}/?page=${page}&limit=10` + url
  );
};
