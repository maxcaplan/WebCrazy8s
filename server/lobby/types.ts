export enum LobbyWorkerMethod {
  GET,
  POST,
}

export interface LobbyWorkerRequest<T = any> {
  method: LobbyWorkerMethod;
  path: string;
  body: T;
}

export interface LobbyWorkerResponse {
  method: LobbyWorkerMethod;
  path: string;
  message: string;
  ok: boolean;
}

export interface LobbyWorkerErrorResponse {
  method?: LobbyWorkerMethod;
  path?: string;
  message: string;
  ok: boolean;
}

export interface LobbyWorkerResponseData<T = {}> extends LobbyWorkerResponse {
  body: T;
}

export interface Player {
  id: string;
  name: string;
}
