import { AxiosResponse } from "axios";

export function logAxiosErrors(fromFunc: string, errorRes?: AxiosResponse) {
  console.log(fromFunc + " status:", errorRes?.status);
  console.log(fromFunc + " statusText:", errorRes?.statusText);
}
