

export interface CtmServerStats {
  applicationsCount: number,
  subApplicationsCount: number,
  hostsCount: number,
  foldersCount: number,
}

export interface CtmNodeStat {
  active: string[],
  activeCount: number,
  disabled: string[],
  disabledCount: number,
}

export interface CtmNodeBasicInfo extends CtmNodeStat {
  node: string;
}

export interface CtmHostInfo {
  server: string;
  group: string;
  host: string;
}

export interface CtmNodeInfo {
  group?: string,
  hosts?: CtmHostInfo[],
  folders: string[],
  jobs: string[],
}
