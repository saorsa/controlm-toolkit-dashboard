

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
